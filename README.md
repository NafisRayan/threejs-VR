## Three.js WebXR Application with Hand Tracking and Animations

This repository contains a Three.js WebXR application that demonstrates hand tracking interactions, dynamic UI elements, and animations within a VR environment. The project leverages Three.js, WebXR APIs, and GLTFLoader to load 3D models, track hand movements, and render animations.

### Key Features:
1. ***Hand Tracking with WebXR***: Integrates hand tracking using WebXR to enable interactions via hand controllers. Users can interact with UI elements such as buttons through raycasting.

2. ***3D Model Loading and Animations***: Utilizes the GLTFLoader to load 3D models, including animations, directly into the scene. Animations are handled using the Three.js AnimationMixer, and are dynamically updated in the render loop.

3. ***Dynamic UI Panels***: Interactive UI panels are displayed in the scene, allowing users to interact with buttons like "Start" and "Exit" using hand pointers. The UI is rendered using Text2D and responds to user input.

4. ***Real-time Animation Updates***: The application maintains a loop to continuously update animations such as walking, which is triggered based on user interactions and the state of the scene.

### Code Highlights:
1. ***Model Loading and Animation***:
    A. The loadModel function is responsible for loading various types of 3D model formats (GLTF, FBX, OBJ) and adding them to the virtual world.
    B. Once the model is loaded, its animations are extracted and stored for use in the animation loop.
2. ***Hand Tracking and UI Interaction***:
    A. The useHand function initializes hand controllers and rays for interacting with objects in the scene.
    B. The UI buttons, such as "Start" and "Exit," are created as interactive meshes that respond to hand raycasts.
3. ***Animation Loop***:
    A. The animate function is responsible for updating the scene in real-time. It handles model animations, user interactions, and scene rendering.

### Getting Started:
1. Clone Repository :
    ```bash
        git clone https://github.com/wildy13/threejs-VR.git
    ```
2. Navigate to the project directory:
    ```bash
        cd threejs-VR
    ```
3. Install the required dependencies:
    ```bash
        npm install
    ```
4. Start the development server:
   ```bash
        npm run dev
    ```
5. Open the application in a WebXR-supported browser or a VR device to start interacting with the scene.
   
### Usage
#### Hand Interaction
1. Hand Rays: Use the hand controllers (or simulated controllers) in VR to interact with 3D UI elements like buttons.
2. UI Buttons: Available buttons include:
   A. Start: Triggers animations like walking or other predefined actions.
   B. Exit: Stops the current session or interaction.
   
#### Model Loading
1. The project supports various 3D model formats:
   A. .glb, .gltf: For GLTF models.
   B. .fbx: For FBX models.
   C. .obj: For OBJ models.
   
#### Animation Handling
1. When the "Start" button is clicked, the application initiates the walk animation (or any other animation defined for the model).
2. Animations are continuously updated within the animate loop, ensuring real-time interaction.

#### Code Overview
1. ***loadModel Function***
   This function is responsible for loading 3D models and adding them to the virtual world. It supports the following formats: GLTF, FBX, and OBJ. The loaded models can be scaled, animated, and interacted with using hand pointers.

2. ***useHand Function***
   This function initializes hand pointers and sets up raycasting for interacting with 3D objects in the scene. UI elements such as buttons can be clicked using these hand rays.

3. ***register Function***
   The register function configures the VR environment by setting up the UI panel, buttons, and other necessary elements. It ensures that once the environment is registered, interactions like starting animations can be triggered.

4. ***animate Function***
   The animate function continuously updates the scene and the animations within it. It also handles rendering, ensuring real-time updates to the UI and hand interactions.

### Technologies Used :
1. Three.js: For rendering 3D graphics and managing animations.
2. WebXR API: For handling hand tracking and enabling virtual reality experiences.
3. GLTFLoader, FBXLoader, OBJLoader: To load 3D models of various formats.
4. JavaScript/ES6: Core programming language used in the project.
 
### Contributing
  Feel free to contribute to this project by submitting pull requests or opening issues.

### License
  his project is licensed under the MIT License. See the LICENSE file for more details.
