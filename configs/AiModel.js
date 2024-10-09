/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};


  export const chatSession = model.startChat({
    generationConfig,
 // safetySettings: Adjust safety settings
 // See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [
      {
        role: "user",
        parts: [
          {text: "write a script to generate 30 seconds video on topic: Interesting historical story along with AI image prompt in Realistic format for each scene and give me result in JSON format with imagePrompt and ContentText as field"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "```json\n[\n  {\n    \"imagePrompt\": \"A bustling marketplace in ancient Rome, with vendors selling goods and people going about their daily lives. The scene should be vibrant and full of detail, with a focus on the architecture and the crowd.\",\n    \"ContentText\": \"In the heart of ancient Rome, a bustling marketplace buzzed with life. Vendors hawked their wares, their voices blending with the clatter of carts and the chatter of merchants. Among the throng, a young man named Gaius stood transfixed, his eyes wide with wonder. Gaius was a newly arrived slave, sold into servitude to a wealthy Roman senator. He had never witnessed such opulence and excitement. He was mesmerized by the vibrant colors, the exotic smells, and the cacophony of sounds.\"\n  },\n  {\n    \"imagePrompt\": \"A close-up shot of a Roman coin, showing intricate details and the inscription 'SPQR'.\",\n    \"ContentText\": \"Suddenly, a commotion broke out. A group of soldiers marched through the marketplace, their armor gleaming in the sunlight. They carried with them a prisoner, his hands bound behind his back. The man wore a simple tunic, his face etched with fear and resignation. As the soldiers passed, Gaius noticed a small, silver coin fall from the prisoner's pocket. It landed at his feet, gleaming in the dust.\"\n  },\n  {\n    \"imagePrompt\": \"A portrait of a Roman senator, dressed in elegant robes and with a stern expression on his face. The senator is sitting in a luxurious chair, surrounded by books and scrolls.\",\n    \"ContentText\": \"Gaius picked up the coin. It was worn, but the inscription was still visible: 'SPQR'. Gaius knew that this stood for 'Senatus Populusque Romanus,' the Senate and the Roman people. The coin was a symbol of the vast power and wealth of Rome, a power that now held this prisoner in its grasp.\"\n  },\n  {\n    \"imagePrompt\": \"A dramatic scene of the prisoner being interrogated in a dimly lit room. The senator is questioning the prisoner, who is desperately trying to defend himself.\",\n    \"ContentText\": \"Later that day, Gaius was ordered to deliver the prisoner to the senator's villa. He followed the soldiers, his heart pounding with a mix of fear and curiosity. He saw the prisoner being dragged into a dimly lit room, where the senator, a stern man with cold eyes, awaited him. The interrogation was harsh. The senator accused the prisoner of treason, demanding answers and confessions.\"\n  },\n  {\n    \"imagePrompt\": \"The prisoner, now revealed to be a Roman general, is being led away in chains. His face is a mask of despair and defiance.\",\n    \"ContentText\": \"But the prisoner remained defiant, denying the charges. He was a Roman general, a hero who had fought bravely in countless battles. Yet, he was now accused of betrayal, his reputation in ruins. Gaius watched in horror as the general was taken away, bound in chains, his fate uncertain.\"\n  },\n  {\n    \"imagePrompt\": \"A close-up of the Roman coin, now clutched in Gaius's hand. The scene is filled with dramatic lighting, emphasizing the coin's importance.\",\n    \"ContentText\": \"As the soldiers marched away, Gaius clutched the coin tightly in his hand. It was more than just a piece of metal; it represented the injustice and the power of Rome. It was a reminder of the fragility of life and the precariousness of power.\"\n  },\n  {\n    \"imagePrompt\": \"A montage of scenes showing Gaius's journey to freedom, culminating in him escaping from the senator's villa and fleeing into the night. The scene should be tense and dramatic, with a sense of urgency.\",\n    \"ContentText\": \"Gaius knew he had to act. He had witnessed the cruelty of the Roman system, and he couldn't stand by any longer. He decided to help the general, to expose the truth and fight for justice. He knew the risk he was taking, but he was determined to make a difference.\"\n  },\n  {\n    \"imagePrompt\": \"Gaius, now free and in disguise, is walking through the city, looking for a way to contact the general's allies. The scene should be filled with the hustle and bustle of ancient Rome, with Gaius trying to remain unnoticed.\",\n    \"ContentText\": \"Gaius escaped from the villa, his heart pounding in his chest. He knew he couldn't stay in Rome. He had to find the general's allies and expose the senator's treachery. But how? The city was vast and dangerous, and he was alone. He had to find a way to contact the general's supporters, but he couldn't risk being caught.\"\n  },\n  {\n    \"imagePrompt\": \"Gaius finds an old friend from the marketplace, who agrees to help him. The scene should be hopeful and uplifting, showing the power of friendship and loyalty.\",\n    \"ContentText\": \"As Gaius wandered through the bustling marketplace, he spotted a familiar face. It was a young man he had befriended during his first few days in Rome. The man was startled to see Gaius, but when he heard his story, he was determined to help. He knew of the general's reputation and the senator's ruthlessness. He promised to help Gaius find the general's allies.\"\n  },\n  {\n    \"imagePrompt\": \"The scene fades to black, with the Roman coin lying on the ground. The inscription 'SPQR' is still visible, but now it feels heavy with the weight of the story just told.\",\n    \"ContentText\": \"With the help of his friend, Gaius managed to escape Rome and reach the general's allies. Together, they exposed the senator's treachery, bringing him to justice. The general was freed, his honor restored. Gaius, once a slave, became a hero, his actions proving that even in the most powerful empires, the will of the people could triumph over injustice.\"\n  }\n]\n```\n\n**Explanation:**\n\nThis JSON data provides 10 scenes for a 30-second video. Each scene has two fields:\n\n* **imagePrompt:** This field contains a detailed description for generating an AI image using tools like Midjourney or DALL-E. \n* **ContentText:** This field provides the narration or dialogue for the scene.\n\n**How to Use:**\n\n1. **Generate Images:** Use the `imagePrompt` text for each scene to create images using your preferred AI image generation tool.\n2. **Edit Images:** You may need to edit or resize the generated images to fit your video format.\n3. **Assemble Video:** Combine the images and narration to create your 30-second video. You can use video editing software like Adobe Premiere Pro, Final Cut Pro, or DaVinci Resolve.\n\n**Additional Tips:**\n\n* **Timing:** Consider the length of the narration text when deciding how long each scene should be in the video.\n* **Music and Sound Effects:** Add appropriate music and sound effects to enhance the video's emotional impact.\n* **Transition Effects:** Use transition effects between scenes to create a smooth flow.\n\n**Note:** This script is just a starting point. You can adapt it to your own preferences and creative vision.  You can adjust the scene descriptions, content text, and visual style to create a unique and engaging historical video. \n"},
        ],
      },
    ],
  });

