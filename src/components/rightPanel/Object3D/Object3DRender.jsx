import { computed, defineComponent, onMounted } from 'vue';
import { useObject3D } from './useObject3D';
import { getEditor } from '@/hooks/useEditor';
import { ElFormItem, ElCheckbox } from 'element-plus';
import SlideInput from '@/components/common/SlideInput.vue';
import Color from '@/components/common/Color.vue';

export default defineComponent({
  components: { SlideInput, Color },
  setup() {
    const { formData, selectedObj, change, updateUI } = useObject3D();

    // 旋转
    const rotation = () => (
      <>
        <ElFormItem class="wrap-content" label="旋转">
          <div class="row">
            x：
            <SlideInput v-model:value={formData.rotation.x} step={1} onChange={() => change('rotation')}></SlideInput>
          </div>
          <div class="row">
            y：
            <SlideInput v-model:value={formData.rotation.y} step={1} onChange={() => change('rotation')}></SlideInput>
          </div>
          <div class="row">
            z：
            <SlideInput v-model:value={formData.rotation.z} step={1} onChange={() => change('rotation')}></SlideInput>
          </div>
        </ElFormItem>
      </>
    );

    // 缩放
    const scale = () => (
      <>
        <ElFormItem class="wrap-content" label="缩放">
          <div class="row">
            x：<SlideInput v-model:value={formData.scale.x} onChange={() => change('scale')}></SlideInput>
          </div>
          <div class="row">
            y：<SlideInput v-model:value={formData.scale.y} onChange={() => change('scale')}></SlideInput>
          </div>
          <div class="row">
            z：<SlideInput v-model:value={formData.scale.z} onChange={() => change('scale')}></SlideInput>
          </div>
        </ElFormItem>
      </>
    );

    // 阴影
    const shadow = (isShowReceiveShadow = true) => (
      <>
        <ElFormItem label="阴影">
          <ElCheckbox v-model={formData.castShadow} label="产生" onChange={() => change('castShadow')} />
          {isShowReceiveShadow ? (
            <ElCheckbox v-model={formData.receiveShadow} label="接受" onChange={() => change('receiveShadow')} />
          ) : (
            ''
          )}
        </ElFormItem>
      </>
    );

    // 光的基础属性
    const lightBase = () => (
      <>
        <ElFormItem label="强度">
          <SlideInput v-model:value={formData.intensity} onChange={() => change('intensity')} />
        </ElFormItem>
        <ElFormItem label="颜色">
          <Color v-model:color={formData.color} onChange={() => change('color')} />
        </ElFormItem>
      </>
    );

    // 光的阴影
    const lightShadow = () => (
      <>
        {shadow(false)}
        <ElFormItem label="阴影偏移">
          <SlideInput v-model:value={formData.shadow.bias} onChange={() => change('bias')} />
        </ElFormItem>
        <ElFormItem v-slots={{ label: () => <span class="minimal-font">阴影法线偏移</span> }}>
          <SlideInput v-model:value={formData.shadow.normalBias} onChange={() => change('normalBias')} />
        </ElFormItem>
        <ElFormItem label="阴影半径">
          <SlideInput v-model:value={formData.shadow.radius} onChange={() => change('radius')} />
        </ElFormItem>
      </>
    );

    const HemisphereLight = () => (
      <>
        <ElFormItem label="基色">
          <Color v-model:color={formData.groundColor} onChange={() => change('groundColor')} />
        </ElFormItem>
      </>
    );

    const distance = () => (
      <>
        <ElFormItem label="距离">
          <SlideInput v-model:value={formData.distance} min={0} onChange={() => change('distance')} />
        </ElFormItem>
      </>
    );

    const decay = () => (
      <>
        <ElFormItem label="衰减">
          <SlideInput v-model:value={formData.decay} min={0} onChange={() => change('decay')} />
        </ElFormItem>
      </>
    );

    const angle = () => (
      <>
        <ElFormItem label="角度">
          <SlideInput v-model:value={formData.angle} min={0} max={Math.PI / 2} onChange={() => change('angle')} />
        </ElFormItem>
      </>
    );

    const penumbra = () => (
      <>
        <ElFormItem label="衰减">
          <SlideInput v-model:value={formData.penumbra} min={0} onChange={() => change('penumbra')} />
        </ElFormItem>
      </>
    );

    const orthographicCamera = () => (
      <>
        <ElFormItem label="左">
          <SlideInput v-model:value={formData.left} onChange={() => change('left')} />
        </ElFormItem>
        <ElFormItem label="右">
          <SlideInput v-model:value={formData.right} onChange={() => change('right')} />
        </ElFormItem>
        <ElFormItem label="上">
          <SlideInput v-model:value={formData.top} onChange={() => change('top')} />
        </ElFormItem>
        <ElFormItem label="下">
          <SlideInput v-model:value={formData.bottom} onChange={() => change('bottom')} />
        </ElFormItem>
      </>
    );

    const far = () => (
      <>
        <ElFormItem label="远点">
          <SlideInput v-model:value={formData.far} onChange={() => change('far')} />
        </ElFormItem>
      </>
    );

    const near = () => (
      <>
        <ElFormItem label="近点">
          <SlideInput v-model:value={formData.near} onChange={() => change('near')} />
        </ElFormItem>
      </>
    );

    const fov = () => (
      <>
        <ElFormItem label="视角">
          <SlideInput v-model:value={formData.fov} onChange={() => change('fov')} />
        </ElFormItem>
      </>
    );
    const most = () => {
      const html = [];
      html.push(rotation());
      html.push(scale());
      html.push(shadow());
      return html;
    };
    const content = {
      Mesh: () => {
        return most();
      },
      Scene: () => {
        return most();
      },
      Line: () => {
        return most();
      },
      Group: () => {
        return most();
      },
      Sprite: () => {
        return most();
      },
      Points: () => {
        return most();
      },
      AmbientLight: () => {
        return lightBase();
      },
      DirectionalLight: () => {
        const html = [];
        html.push(lightBase());
        html.push(lightShadow());
        return html;
      },
      HemisphereLight: () => {
        const html = [];
        html.push(lightBase());
        html.push(HemisphereLight());
        return html;
      },
      PointLight: () => {
        const html = [];
        html.push(lightBase());
        html.push(distance());
        html.push(decay());
        html.push(lightShadow());
        return html;
      },
      SpotLight: () => {
        const html = [];
        html.push(lightBase());
        html.push(distance());
        html.push(angle());
        html.push(penumbra());
        html.push(decay());
        html.push(lightShadow());
        return html;
      },
      OrthographicCamera: () => {
        const html = [];
        html.push(rotation());
        html.push(scale());
        html.push(orthographicCamera());
        html.push(near());
        html.push(far());
        html.push(shadow());
        return html;
      },
      PerspectiveCamera: () => {
        const html = [];
        html.push(rotation());
        html.push(scale());
        html.push(fov());
        html.push(near());
        html.push(far());
        html.push(shadow());
        return html;
      }
    };
    return () => {
      return <>{selectedObj.value ? content[selectedObj.value.type]?.() : ''}</>;
    };
  }
});
