import { Button } from '@/components/ui/button';
import { Mic, Paperclip, Send } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import AiMultiModels from './AiMultiModels';
import { AiSelectedModelContext } from '@/context/AiSelectedModelContext';
import axios from 'axios';

const ChatInputBox = () => {
  const [userInput, setUserInput] = useState('');
  const { AiSelectedModels, setAiSelectedModels, messages, setMessages } =
    useContext(AiSelectedModelContext);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    // 1️⃣ Add user message to all enabled models
    setMessages((prev) => {
      const updated = { ...prev };
      Object.keys(AiSelectedModels).forEach((modelKey) => {
        if (AiSelectedModels[modelKey]?.enable) {
          updated[modelKey] = [
            ...(updated[modelKey] ?? []),
            { role: 'user', content: userInput },
          ];
        }
      });
      return updated;
    });

    const currentInput = userInput; // capture before reset
    setUserInput('');

    // 2️⃣ Fetch response from each enabled model
    Object.entries(AiSelectedModels).forEach(
      async ([parentModel, modelInfo]) => {
        if (!modelInfo.modelId || AiSelectedModels[parentModel].enable == false)
          return;

        // Add loading placeholder before API call
        setMessages((prev) => ({
          ...prev,
          [parentModel]: [
            ...(prev[parentModel] ?? []),
            {
              role: 'assistant',
              content: 'Thinking...',
              model: parentModel,
              loading: true,
            },
          ],
        }));

        try {
          const result = await axios.post('/api/ai-multi-model', {
            model: modelInfo.modelId,
            msg: [{ role: 'user', content: currentInput }],
            parentModel,
          });

          const { aiResponse, model } = result.data;

          // 3️⃣ Add AI response to that model’s messages
          setMessages((prev) => {
            const updated = [...(prev[parentModel] ?? [])];
            const loadingIndex = updated.findIndex((m) => m.loading);

            if (loadingIndex !== -1) {
              updated[loadingIndex] = {
                role: 'assistant',
                content: aiResponse,
                model,
                loading: false,
              };
            } else {
              // fallback if no loading msg found
              updated.push({
                role: 'assistant',
                content: aiResponse,
                model,
                loading: false,
              });
            }

            return { ...prev, [parentModel]: updated };
          });
        } catch (err) {
          console.error(err);
          setMessages((prev) => ({
            ...prev,
            [parentModel]: [
              ...(prev[parentModel] ?? []),
              { role: 'assistant', content: '⚠️ Error fetching response.' },
            ],
          }));
        }
      }
    );
  };

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <div className="relative min-h-screen">
      <div>
        <AiMultiModels />
      </div>
      <div className="fixed bottom-0 left-0 flex justify-center w-full px-4 pb-4">
        <div className="w-full border rounded-xl shadow-md max-w-2xl p-4">
          <input
            type="text"
            placeholder="Ask me anything.."
            className="border-0 outline-0 w-full"
            value={userInput}
            onChange={(event) => setUserInput(event?.target?.value)}
          />
          <div className="mt-3 flex items-center justify-between">
            <Button variant={'ghost'} size={'icon'}>
              <Paperclip className={'h-5 w-5'} />
            </Button>
            <div className="flex gap-5">
              <Button variant={'ghost'} size={'icon'}>
                <Mic />
              </Button>
              <Button size={'icon'} onClick={handleSend}>
                <Send />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInputBox;
