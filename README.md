<img width="1011" height="719" alt="Screenshot 2026-02-21 082638" src="https://github.com/user-attachments/assets/8f9b5f26-1746-4221-96a5-423ee7cbd4b6" /><img width="1011" height="719" alt="Screenshot 2026-02-21 082638" src="https://github.com/user-attachments/assets/daf6d138-8869-4137-af95-783f173d0dfa" /><p align="center">
  <img src="./img.png" alt="Project Banner" width="100%">
</p>
# [trustlens] 🎯
## Basic Details
### Team Name: [ANP]
### Team Members
- Member 1: [Nandhana vinod] - [College of engineering kalloopara]
- Member 2: [Parvathy sreekumar] - [College of engineering kalloopara]
### Hosted Project Link
[http://localhost:5174/](https://www.google.com/search?q=http://localhost:5174/)
### Project Description
An advanced web-based utility designed to identify whether an image is AI-generated, modified, or authentic. By leveraging the Gemini Flash 2.5 API, the tool analyzes visual patterns to provide a clear verdict, confidence level, and detailed reasoning.
### The Problem statement
The digital landscape is facing a rapid increase in AI-generated images, making it increasingly difficult for users to identify manipulated or fake visuals. This creates a high risk of misinformation and digital fraud across social media and news platforms.
### The Solution
We provide a scalable web-based detector that uses Gemini Flash 2.5 to scrutinize image patterns. The system converts user uploads into Base64 format and processes them through the AI to return a specific verdict (AI Generated, AI Modified, or Authentic) to support digital authenticity and trust.
## Technical Details
### Technologies/Components Used
**For Software:**
*
**Languages used:** JavaScript 
* 
**Frameworks used:** React 
* 
**Libraries used:** Gemini Flash 2.5 API 
* 
**Tools used:** Vite (Build Tool), VS Code 
## Features
List the key features of your project:
* 
**AI Pattern Analysis:** Uses Gemini Flash 2.5 to detect synthetic visual artifacts.
* 
**Detailed Verdicts:** Categorizes images as AI Generated, AI Modified, or Authentic.
* 
**Confidence Scoring:** Displays a percentage-based confidence level for every analysis.


* 
**Dark-Mode UI:** A clean, modern user interface optimized for professional use.



---

## Implementation

### For Software:

#### Installation

```bash
npm install

```

#### Run

```bash
npm run dev

```

---

## Project Documentation

### For Software:

#### Screenshots (Add at least 3)

![Screenshot1](<img width="1636" height="965" alt="Screenshot 2026-02-21 081114" src="https://github.com/user-attachments/assets/2a0e2b47-8a7d-4a33-b660-6ba4cde483b1" />)

*The landing page featuring the image upload zone.*

![Screenshot2](<img width="1703" height="955" alt="Screenshot 2026-02-21 081531" src="https://github.com/user-attachments/assets/4d55415a-25be-4bfe-bc26-33d8b03e555e" />)

*Analysis in progress showing the Base64 conversion status.*

![Screenshot3](![Uploading Screenshot 2026-02-21 082638.png…])
)

*Result screen displaying the AI Verdict and Reasoning.*

#### Diagrams

**System Architecture:**

*The frontend is built with React and Vite, which communicates with the Gemini Flash 2.5 API. Images are processed locally into Base64 before being sent for cloud analysis.*

**Application Workflow:**

1. User uploads image.


2. Frontend converts image to Base64.


3. Data is sent to Gemini Flash 2.5 API.


4. AI analyzes patterns and returns a verdict.



---

## Additional Documentation

### Future Scope

* 
**Deepfake Detection:** Integrate CNN-based models for enhanced deepfake identification.


* 
**Metadata Analysis:** Analyze EXIF data to check for source authenticity.


* 
**Batch Processing:** Allow users to upload and scan multiple images simultaneously.


* 
**Browser Extension:** Deploy as a tool for real-time verification on social media.



---



## AI Tools Used

**Tool Used:** Gemini Flash 2.5 API

**Purpose:** Core analysis engine for image pattern recognition and verdict generation.

**Percentage of AI-generated code:** Approximately 10% (API Integration boilerplate).

**Human Contributions:**

* Full UI/UX design and Frontend development.


* Implementation of Base64 conversion logic.


* System architecture and API integration workflow.



---

## Team Contributions

* 
**Member 1**: Developed frontend using React + Vite and designed the dark-mode UI.


* 
**Member 2**: Integrated Gemini Flash 2.5 API and implemented Base64 conversion logic.



---

## License

This project is licensed under the MIT License.

---

Made with ❤️ at TinkerHub
