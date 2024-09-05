import { ButtonSystem } from '../systems/ButtonSystem.js';
import { DraggableSystem } from '../systems/draggableSystem.js';
import { HandRaySystem } from '../systems/handRaySystem.js';
import { InstructionSystem } from '../systems/InstructionSystem.js';
import { PanelSystem } from '../systems/PanelSystem.js'

import { Button } from '../components/ButtonComponent.js';
import { Intersectable } from '../components/intersectableComponent.js';
import { Draggable } from '../components/DraggableComponent.js';
import { HandsInstructionText } from '../components/HandsInstructionText.js';
import { Object3D } from '../components/Object3DComponent.js'
import { Panel } from '../components/PanelComponent.js';

import * as THREE from 'three';


export const register = (world, options) => {
    if(world.hasRegisteredComponent(Object3D) === false) {
        world.registerComponent(Object3D);
    }
    options.requiredFeatures.forEach(val => {

        if (val.includes('button')) {
            world.registerComponent(Button);
            world.registerSystem(ButtonSystem);

            for (let i = 0; i < options.button.length; i++) {
                const buttonEntity = world.createEntity();
                buttonEntity.addComponent(Object3D, { object: options.button[i].mesh });
                buttonEntity.addComponent(Intersectable);
                if(options.button[i].onClick) {
                    const action = options.button[i].onClick;
                    buttonEntity.addComponent(Button, { action: action });
                }

            }
        } else if (val.includes('draggable')) {
            world.registerComponent(Draggable);
            world.registerSystem(DraggableSystem);
        } else if (val.includes('handRay')) {
            world.registerComponent(Intersectable);
            world.registerSystem(HandRaySystem, { handPointers: options.handPointers });
        } else if (val.includes('intruction')) {
            world.registerComponent(HandsInstructionText);
            world.registerSystem(InstructionSystem, { controllers: options.controllers });
        } else if (val.includes('panel')) {
            world.registerComponent(Panel);
            world.registerComponent(Draggable);
            world.registerSystem(DraggableSystem);  
            world.registerSystem(PanelSystem, { panel: options.panel});
            
            const panelEntity = world.createEntity();
            panelEntity.addComponent(Panel, ...options.panel);
            panelEntity.addComponent(Draggable);
            panelEntity.addComponent(Intersectable);      
            const object = world.getSystem(PanelSystem).getPanelGroup();
            panelEntity.addComponent(Object3D, { object: object });
        }
    });

    return world;
}
