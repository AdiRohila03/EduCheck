from transformers import Qwen2VLForConditionalGeneration, AutoProcessor, AutoConfig
from qwen_vl_utils import process_vision_info
from PIL import Image
from io import BytesIO
import torch

# config = AutoConfig.from_pretrained("config.json")
# model = Qwen2VLForConditionalGeneration(config)
# model.load_state_dict(torch.load("ocr_model.pth", map_location="cpu"))

# print("model loaded successfully")
processor = AutoProcessor.from_pretrained("models/tokenized_ocr_model", local_files_only=True)
model = Qwen2VLForConditionalGeneration.from_pretrained("models/tokenized_ocr_model", local_files_only=True)


# model.save_pretrained("models/tokenized_ocr_model")
# processor.save_pretrained("models/tokenized_ocr_model")



class OCR : 
    def __init__(self):
        pass

    def start(self, image):
        # Decoding image from binary form:
        img = Image.open(BytesIO(image))
        img = img.resize((1024,1024))
        img = img.convert('RGB')
        
        print(img)
        # Creating input required as per model 
        messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "image": img
                },
                {"type": "text", "text": "Extract and return the tokenized OCR text from the image."},
            ],
        }]

        # Prepare input for model 
        text = processor.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
        image_inputs, video_inputs = process_vision_info(messages)

        inputs = processor(
            text=[text],
            images=image_inputs,  
            videos=video_inputs,
            padding=True,
            return_tensors="pt",
        )
        print(1)
        # Generate output
        with torch.no_grad():
            generated_ids = model.generate(**inputs, max_new_tokens=10000)
        print("2")
        # Trim and decode output
        generated_ids_trimmed = [
            out_ids[len(in_ids) :] for in_ids, out_ids in zip(inputs['input_ids'], generated_ids)
        ]
        output_text = processor.batch_decode(
            generated_ids_trimmed, skip_special_tokens=True, clean_up_tokenization_spaces=False
        )
        #print(output_text)

        return output_text
