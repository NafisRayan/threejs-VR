import { System } from 'three/addons/libs/ecsy.module.js';
import { Button } from '../components/ButtonComponent.js';
import { Object3D } from '../components/Object3DComponent.js';

export class ButtonSystem extends System {
    execute() {
        this.queries.buttons.results.forEach(entity => {
            const button = entity.getMutableComponent(Button);
            const buttonMesh = entity.getComponent(Object3D).object;

            buttonMesh.scale.set(button.currState === 'none' ? 1 : 1.1, button.currState === 'none' ? 1 : 1.1, button.currState === 'none' ? 1 : 1.1);

            if (button.currState === 'pressed' && button.prevState !== 'pressed') {
                button.action();
            }

            button.prevState = button.currState;
            button.currState = 'none';
        });
    }
}

ButtonSystem.queries = {
    buttons: { components: [Button] }
};
