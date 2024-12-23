import os
import subprocess


# FFmpeg command template
ffmpeg_command = "ffmpeg -i \"{input}\" -b:a 16k -ar 16000 \"{output}\""

def convert_audio_files(folder_path, language):

    #make folder path dynamic based on the language
    folder_path = folder_path + f"/{language}/audio"

    # Check if the folder exists
    if not os.path.exists(folder_path):
        print(f"Error: Folder '{folder_path}' does not exist.")
        return

    # Process each .wav file in the folder
    for filename in os.listdir(folder_path):
        if filename.endswith(".wav"):
            input_path = os.path.join(folder_path, filename)
            output_path = os.path.join(folder_path, f"{os.path.splitext(filename)[0]}_temp.mp3")

            # Run FFmpeg command
            command = ffmpeg_command.format(input=input_path, output=output_path)
            print(f"Processing: {filename}")
            subprocess.run(command, shell=True)

            # Replace the original .wav file with the new .mp3 file
            os.remove(input_path)
            os.rename(output_path, input_path)
            print(f"Replaced {filename} with its converted version.")

    print("Conversion completed.")

# Path to the folder containing the audio files
input_folder = "/Users/alikesserwani/Desktop/linguaberrymobile/assets/data/stories"

#make it loop through all the languages
languages = ["Dutch", "French", "German", "Greek", "Hebrew", "Hindi", "Italian", "Korean", "Portuguese", "Russian", "Spanish", "Swedish", "Turkish"]
for i in languages:
    convert_audio_files(input_folder, i)
