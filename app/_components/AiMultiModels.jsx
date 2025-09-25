import AIModelList from '@/shared/AIModelList';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader, Lock, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AiSelectedModelContext } from '@/context/AiSelectedModelContext';
import { useUser } from '@clerk/nextjs';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/FirebaseConfig';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
const AiMultiModels = () => {
  const [aiModelList, setAiModelList] = useState(AIModelList);

  const { AiSelectedModels, setAiSelectedModels, messages, setMessages } =
    useContext(AiSelectedModelContext);
  const { user } = useUser();

  const onToggleChange = (model, value) => {
    setAiModelList((prev) =>
      prev.map((m) => (m.model === model ? { ...m, enable: value } : m))
    );
    setAiSelectedModels((prev) => ({
      ...prev,
      [model]: {
        ...(prev?.[model] ?? {}),
        enable: value,
      },
    }));
  };
  useEffect(() => {
    console.log(AiSelectedModels);
  }, [AiSelectedModels]);

  const onSelectedValue = async (parentModel, value) => {
    setAiSelectedModels((prev) => ({
      ...prev,
      [parentModel]: {
        modelId: value,
      },
    }));

    
  };

  return (
    <div className="flex flex-1 h-[75vh] border-b">
      {aiModelList &&
        aiModelList.map((model, index) => (
          <div
            className={`flex flex-col border-r h-full overflow-auto  ${
              model.enable ? 'flex-1 min-w-[400px]' : 'flex-none min-w-[100px]'
            }`}
            key={index}
          >
            <div
              key={index}
              className="flex w-full h-[70px] items-center justify-between border-b p-4"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={model.icon}
                  alt={model.model}
                  height={24}
                  width={24}
                />
                {model.enable && (
                  <Select
                    defaultValue={AiSelectedModels[model.model]?.modelId}
                    onValueChange={(value) =>
                      onSelectedValue(model.model, value)
                    }
                    disabled={model.premium}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue
                        placeholder={AiSelectedModels[model.model]?.modelId}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="px-3">
                        <SelectLabel className={'text-sm text-gray-400'}>
                          Free
                        </SelectLabel>
                        {model.subModel.map(
                          (submodel, index) =>
                            submodel.premium == false && (
                              <SelectItem key={index} value={submodel.id}>
                                {submodel.name}
                              </SelectItem>
                            )
                        )}
                      </SelectGroup>
                      <SelectGroup className="px-3">
                        <SelectLabel className={'text-sm text-gray-400'}>
                          premium
                        </SelectLabel>
                        {model.subModel.map(
                          (submodel, index) =>
                            submodel.premium == true && (
                              <SelectItem
                                key={index}
                                value={submodel.name}
                                disabled={submodel.premium}
                              >
                                {submodel.name} <Lock className="w-4 h-4" />
                              </SelectItem>
                            )
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div>
                {model.enable ? (
                  <Switch
                    checked={model.enable}
                    onCheckedChange={(v) => onToggleChange(model.model, v)}
                  />
                ) : (
                  <MessageSquare
                    onClick={() => onToggleChange(model.model, true)}
                  />
                )}
              </div>
            </div>
            {model.premium && model.enable && (
              <div className="flex items-center justify-center h-full">
                <Button>
                  <Lock /> Upgrade to Unlock
                </Button>
              </div>
            )}
            {model.enable && (
              <div className="flex-1 p-4">
                <div className="flex-1 p-4 space-y-2">
                  {messages &&
                    messages[model.model]?.map((m, i) => (
                      <div
                        className={`p-2 rounded-md ${
                          m.role == 'user'
                            ? 'bg-blue-100 text-blue-900'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                        key={i}
                      >
                        {m.role == 'assistant' && (
                          <span className="text-sm text-gray-300">
                            {m.model ?? model.model}
                          </span>
                        )}
                        {m.content == 'Thinking...' && (
                          <>
                            <Loader className="animate-spin" />{' '}
                            <span>Thinking...</span>
                          </>
                        )}
                        {m.content != 'Thinking...' && (
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {m.content}
                          </ReactMarkdown>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default AiMultiModels;
