# Automation Quest | Must Company

## Instructions

- In order to run the last test in a linux machine make sure you have a docker desktop installed can run the docker commands
- In case you don't have https://www.docker.com/products/docker-desktop/

## Dependencies

- run "nvm use" to make sure you have the same node version
- run "npm install" to install all dependencies
- run "npx playwright install --with-deps chromium" to install playwright

## DETAILS!

- The downloads file should be empty to make sure the scripts will add the new files to the directory.

## Running the quests

- Quest 1: To complete the quest I used the "https://the-internet.herokuapp.com/download" site as example, and the script is targeting the file "P12_TestOtomasyonuFullPage.pdf", in order to run the script open the "index.js" file and uncomment the "scripts.crawlingRPA()" function, after that you can run the command "npm run start"

- Quest 2: Inside the directory "helper_files" you will find "CV_Asafe-Alves(EN).pdf" and "CV_Asafe-Alves(PT).pdf files, to complete the second quest you need to go to the "index.js" file and uncomment the "mergePDFs()" function, after that you can run "npm run start" to generate the "merged_doc.pdf"

- Quest 3: Inside the directory "helper_files" you have the "korean_sample.pdf" file, to complete the third quest and translate it you can uncomment the "translatePDF()" function and run "npm run start" to transalte the file and generate the "translated_sample.pdf"

- Quest 4: To complete the forth quest I used the "https://quotes.toscrape.com/" site as example, to run the script in a linux machine as required, first you need to run the command "docker build -t linux-crawler ." in your bash, then run the command "docker run --rm -v ${PWD}/downloads:/app/downloads linux-crawler" to generate the file "extracted_data.json"

## EXTRA

- I also made some test suites to assert the scripts behaivor, feel free to test it running the command "npm run test"
