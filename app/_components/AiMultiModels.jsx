import AIModelList from '@/shared/AIModelList';
import Image from 'next/image';
import React, { useContext, useState } from 'react';
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
import { Lock, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AiSelectedModelContext } from '@/context/AiSelectedModelContext';
import { useUser } from '@clerk/nextjs';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/FirebaseConfig';

const AiMultiModels = () => {
  const [aiModelList, setAiModelList] = useState(AIModelList);
  const { AiSelectedModels, setAiSelectedModels } = useContext(
    AiSelectedModelContext
  );
  const { user } = useUser();

  const onToggleChange = (model, value) => {
    setAiModelList((prev) =>
      prev.map((m) => (m.model === model ? { ...m, enable: value } : m))
    );
  };

  const onSelectedValue = async (parentModel, value) => {
    setAiSelectedModels((prev) => ({
      ...prev,
      [parentModel]: {
        modelId: value,
      },
    }));

    const docref = doc(db, 'users', user?.primaryEmailAddress?.emailAddress);
    await updateDoc(docref, {
      selectedModel: AiSelectedModels,
    });
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
                    defaultValue={AiSelectedModels[model.model].modelId}
                    onValueChange={(value) =>
                      onSelectedValue(model.model, value)
                    }
                    disabled={model.premium}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue
                        placeholder={AiSelectedModels[model.model].modelId}
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
                          Premeium
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
          </div>
        ))}
    </div>
  );
};

export default AiMultiModels;
