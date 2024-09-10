import { System } from 'three/addons/libs/ecsy.module.js';
import { Object3D } from '../components/Object3DComponent.js';
import { HandsInstructionText } from '../components/HandsInstructionText.js';

export class InstructionSystem extends System {

    init(attributes) {

        this.controllers = attributes.controllers;

    }

    execute( /*delta, time*/) {

        let visible = false;
        this.controllers.forEach(controller => {

            if (controller.visible) {

                visible = true;

            }

        });

        this.queries.instructionTexts.results.forEach(entity => {

            const object = entity.getComponent(Object3D).object;
            object.visible = visible;

        });

    }

}

InstructionSystem.queries = {
    instructionTexts: {
        components: [HandsInstructionText]
    }
};