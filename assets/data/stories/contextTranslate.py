
#import chatgpt api 
import openai
openai.api_key = "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"


#TTS SDK
import json
import random
import os
import azure.cognitiveservices.speech as speechsdk
import re
import string


#root stories file
base_url = "/Users/alikesserwani/Desktop/LinguaBerry/linguaberrymobile/assets/data/stories"


def translateWord(word, sentence, target_language):
        
    #prompt data
    prompt = ( f"Translate the word '{word}' into English considering its context in the sentence: " f"'{sentence}'. Only provide the translated word.")
        
    response = openai.ChatCompletion.create( 
        model="gpt-4o-mini", 
        messages=[{"role": "user", "content": prompt}])

    translation = response["choices"][0]["message"]["content"].strip()

    return translation



#this is a custom chatGPT function that will translate the texts contextually
def contextualTranslate(data, target_language):

    #the data will be the full json stories
    # Process each story
    story_translations = {}

    for story in data:
        title = story['title']
        sentences = story['story_translation'].split('.')  # Split story into sentences
        words = set(story['story_translation'].replace(',', '').replace('.', '').split())  # Extract unique words

        
        # Translate each word
        word_translations = {}

        for word in words:
            sentence = next((s for s in sentences if word in s), "")
            if sentence:
                translated_word = translateWord(word, sentence, target_language)
                word_translations[word] = translated_word

        story_translations[title] = word_translations

        print("Translated " + title + " in " + target_language)

    return story_translations


languages = ["Italian"]

for language in languages:

    #load respective JSON file
    url = base_url + f'/{language}/{language}_stories.json'
    with open(url, "r", encoding="utf-8") as file:
        data = json.load(file)


    # Define the output directory and ensure it exists
    output_dir = os.path.join(base_url, language)
    os.makedirs(output_dir, exist_ok=True)
    # Create the output directory if it does not exist
    output_file_name = f"{language}_words.json"
    output_file_path = os.path.join(output_dir, output_file_name)

    # Create the output file with an initial empty structure if it does not exist
    if not os.path.exists(output_file_path):
        with open(output_file_path, "w", encoding="utf-8") as f:
            json.dump([], f, ensure_ascii=False, indent=4)  # Initialize with an empty list
        print(f"Created output file: {output_file_path}")


    generatedData = contextualTranslate(data, language)


    # Save to the specified directory
    with open(output_file_path, "w", encoding="utf-8") as f:
        json.dump(generatedData, f, ensure_ascii=False, indent=4)

    print(f"Saved: {output_file_path}")
