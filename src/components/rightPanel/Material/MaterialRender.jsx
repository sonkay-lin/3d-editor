import { defineComponent } from 'vue';
import { useMaterial } from './useMaterial';
import SideType from './Select.SideType.vue';
import BlendingType from './Select.Blending.vue';
import DepthPackingSelect from './Select.DepthPacking.vue';
import MapTexture from './MapTexture.vue';
import { materialType } from './MaterialParameters';
import { ElFormItem, ElCheckbox } from 'element-plus';
import SlideInput from '@/components/common/SlideInput.vue';
import Color from '@/components/common/Color.vue';

export default defineComponent({
  components: { SideType, BlendingType, DepthPackingSelect, MapTexture, SlideInput, Color },
  setup() {
    const { formData, change } = useMaterial();
    const renderHtml = {
      color: () => (
        <ElFormItem label="颜色">
          <Color v-model:color={formData.value.color} onChange={() => change('color')} />
        </ElFormItem>
      ),
      program: () => <ElFormItem label="程序">TODO中</ElFormItem>,
      emissive: () => (
        <ElFormItem label="自发光">
          <div class="row">
            <Color v-model:color={formData.value.emissive} onChange={() => change('emissive')} />
            <SlideInput
              onlyNumber={true}
              v-model:value={formData.value.emissiveIntensity}
              min={0}
              onChange={() => change('emissiveIntensity')}
            />
          </div>
        </ElFormItem>
      ),
      specular: () => (
        <ElFormItem label="高光">
          <Color v-model:color={formData.value.specular} onChange={() => change('specular')} />
        </ElFormItem>
      ),
      shininess: () => (
        <ElFormItem label="高光大小">
          <SlideInput v-model:value={formData.value.shininess} onChange={() => change('shininess')} />
        </ElFormItem>
      ),
      reflectivity: () => (
        <ElFormItem label="反射率">
          <SlideInput v-model:value={formData.value.reflectivity} step={0.01} onChange={() => change('reflectivity')} />
        </ElFormItem>
      ),
      roughness: () => (
        <ElFormItem label="粗糙度">
          <SlideInput
            v-model:value={formData.value.roughness}
            max={1}
            min={0}
            step={0.01}
            onChange={() => change('roughness')}
          />
        </ElFormItem>
      ),
      metalness: () => (
        <ElFormItem label="金属度">
          <SlideInput
            v-model:value={formData.value.metalness}
            max={1}
            min={0}
            step={0.01}
            onChange={() => change('metalness')}
          />
        </ElFormItem>
      ),
      clearcoat: () => (
        <ElFormItem label="清漆">
          <SlideInput v-model:value={formData.value.clearcoat} onChange={() => change('clearcoat')} />
        </ElFormItem>
      ),
      clearcoatRoughness: () => (
        <ElFormItem v-slots={{ label: () => <span class="minimal-font">清漆粗糙度</span> }}>
          <SlideInput v-model:value={formData.value.clearcoatRoughness} onChange={() => change('clearcoatRoughness')} />
        </ElFormItem>
      ),
      iridescence: () => (
        <ElFormItem label="彩虹色">
          <SlideInput v-model:value={formData.value.iridescence} onChange={() => change('iridescence')} />
        </ElFormItem>
      ),
      iridescenceIOR: () => (
        <ElFormItem v-slots={{ label: () => <span class="minimal-font">彩虹色折射率</span> }}>
          <SlideInput v-model:value={formData.value.iridescenceIOR} onChange={() => change('iridescenceIOR')} />
        </ElFormItem>
      ),
      // TODO
      // iridescenceThicknessRange: () => (
      //   <ElFormItem label="彩虹色厚度">
      //     <SlideInput
      //       v-model:value={formData.value.iridescenceThicknessRange}
      //       onChange={() => change('iridescenceThicknessRange')}
      //     />
      //   </ElFormItem>
      // ),
      sheen: () => (
        <ElFormItem label="光泽层">
          <SlideInput v-model:value={formData.value.sheen} onChange={() => change('sheen')} />
        </ElFormItem>
      ),
      sheenRoughness: () => (
        <ElFormItem v-slots={{ label: () => <span class="minimal-font">光泽层粗糙度</span> }}>
          <SlideInput v-model:value={formData.value.sheenRoughness} onChange={() => change('sheenRoughness')} />
        </ElFormItem>
      ),
      transmission: () => (
        <ElFormItem label="透光率">
          <SlideInput v-model:value={formData.value.transmission} onChange={() => change('transmission')} />
        </ElFormItem>
      ),
      attenuationDistance: () => (
        <ElFormItem label="衰减距离">
          <SlideInput
            v-model:value={formData.value.attenuationDistance}
            step={1}
            precision={0}
            onChange={() => change('attenuationDistance')}
          />
        </ElFormItem>
      ),
      attenuationColor: () => (
        <ElFormItem label="衰减色">
          <Color v-model:color={formData.value.attenuationColor} onChange={() => change('attenuationColor')} />
        </ElFormItem>
      ),
      thickness: () => (
        <ElFormItem label="厚度">
          <SlideInput v-model:value={formData.value.thickness} onChange={() => change('thickness')} />
        </ElFormItem>
      ),

      vertexColors: () => (
        <ElFormItem label="顶点颜色">
          <ElCheckbox v-model={formData.value.vertexColors} onChange={() => change('vertexColors')} />
        </ElFormItem>
      ),
      depthPacking: () => (
        <ElFormItem label="深度包装">
          <DepthPackingSelect v-model={formData.value.depthPacking} onChange={() => change('depthPacking')} />
        </ElFormItem>
      ),
      size: () => (
        <ElFormItem label="大小">
          <SlideInput v-model:value={formData.value.size} min={0} onChange={() => change('size')} />
        </ElFormItem>
      ),

      map: () => (
        <ElFormItem label="贴图">
          <MapTexture property="map" />
        </ElFormItem>
      ),
      matcap: () => (
        <ElFormItem label="材质捕获">
          <MapTexture property="matcap" />
        </ElFormItem>
      ),
      specularMap: () => (
        <ElFormItem label="高光贴图">
          <MapTexture property="specularMap" />
        </ElFormItem>
      ),
      emissiveMap: () => (
        <ElFormItem v-slots={{ label: () => <span class="minimal-font">自发光贴图</span> }}>
          <MapTexture property="emissiveMap" />
        </ElFormItem>
      ),
      alphaMap: () => (
        <ElFormItem label="透明贴图">
          <MapTexture property="alphaMap" />
        </ElFormItem>
      ),
      envMap: () => (
        <ElFormItem label="环境贴图">
          <MapTexture property="envMap" />
        </ElFormItem>
      ),

      bumpMap: () => (
        <ElFormItem label="凹凸贴图">
          <MapTexture property="bumpMap" />
        </ElFormItem>
      ),
      normalMap: () => (
        <ElFormItem label="法线贴图">
          <MapTexture property="normalMap" />
        </ElFormItem>
      ),
      displacementMap: () => (
        <ElFormItem label="置换贴图">
          <MapTexture property="displacementMap" />
        </ElFormItem>
      ),
      roughnessMap: () => (
        <ElFormItem label="粗糙贴图">
          <MapTexture property="roughnessMap" />
        </ElFormItem>
      ),
      metalnessMap: () => (
        <ElFormItem label="金属贴图">
          <MapTexture property="metalnessMap" />
        </ElFormItem>
      ),
      lightMap: () => (
        <ElFormItem label="光照贴图">
          <MapTexture property="lightMap" />
        </ElFormItem>
      ),
      aoMap: () => (
        // <ElFormItem class="minimal-font" label="环境光遮蔽贴图">
        <ElFormItem v-slots={{ label: () => <span class="minimal-font">环境光遮蔽贴图</span> }}>
          <MapTexture property="aoMap" />
        </ElFormItem>
      ),
      gradientMap: () => (
        <ElFormItem label="渐变贴图">
          <MapTexture property="gradientMap" />
        </ElFormItem>
      ),
      clearcoatMap: () => (
        <ElFormItem label="清漆贴图">
          <MapTexture property="clearcoatMap" />
        </ElFormItem>
      ),
      clearcoatNormalMap: () => (
        <ElFormItem v-slots={{ label: () => <span class="minimal-font">清漆法线贴图</span> }}>
          <MapTexture property="clearcoatNormalMap" />
        </ElFormItem>
      ),
      clearcoatRoughnessMap: () => (
        <ElFormItem v-slots={{ label: () => <span class="minimal-font">清漆粗糙度贴图</span> }}>
          <MapTexture property="clearcoatRoughnessMap" />
        </ElFormItem>
      ),
      iridescenceMap: () => (
        <ElFormItem v-slots={{ label: () => <span class="minimal-font">彩虹色贴图</span> }}>
          <MapTexture property="iridescenceMap" />
        </ElFormItem>
      ),
      iridescenceThicknessMap: () => (
        <ElFormItem v-slots={{ label: () => <span class="minimal-font">彩虹色厚度贴图</span> }}>
          <MapTexture property="iridescenceThicknessMap" />
        </ElFormItem>
      ),
      sheenColorMap: () => (
        <ElFormItem v-slots={{ label: () => <span class="minimal-font">光泽颜色贴图</span> }}>
          <MapTexture property="sheenColorMap" />
        </ElFormItem>
      ),
      sheenRoughnessMap: () => (
        <ElFormItem v-slots={{ label: () => <span class="minimal-font">光泽粗糙度贴图</span> }}>
          <MapTexture property="sheenRoughnessMap" />
        </ElFormItem>
      ),
      transmissionMap: () => (
        <ElFormItem label="透光贴图">
          <MapTexture property="transmissionMap" />
        </ElFormItem>
      ),
      thicknessMap: () => (
        <ElFormItem label="厚度贴图">
          <MapTexture property="thicknessMap" />
        </ElFormItem>
      ),

      blending: () => (
        <ElFormItem label="混合">
          <BlendingType v-model={formData.value.blending} onChange={() => change('blending')} />
        </ElFormItem>
      ),
      side: () => (
        <ElFormItem label="面">
          <SideType v-model={formData.value.side} onChange={() => change('side')} />
        </ElFormItem>
      ),
      flatShading: () => (
        <ElFormItem label="平面着色">
          <ElCheckbox v-model={formData.value.flatShading} onChange={() => change('flatShading')} />
        </ElFormItem>
      ),
      opacity: () => (
        <ElFormItem label="透明度">
          <SlideInput v-model:value={formData.value.opacity} max={1} step={0.01} onChange={() => change('opacity')} />
        </ElFormItem>
      ),
      transparent: () => (
        <ElFormItem label="透明性">
          <ElCheckbox v-model={formData.value.transparent} onChange={() => change('transparent')} />
        </ElFormItem>
      ),
      alphaTest: () => (
        <ElFormItem label="a测试">
          <SlideInput
            v-model:value={formData.value.alphaTest}
            max={1}
            step={0.01}
            onChange={() => change('alphaTest')}
          />
        </ElFormItem>
      ),
      forceSinglePass: () => (
        <ElFormItem v-slots={{ label: () => <span class="minimal-font">单通道渲染</span> }}>
          <ElCheckbox v-model={formData.value.forceSinglePass} onChange={() => change('forceSinglePass')} />
        </ElFormItem>
      ),
      sizeAttenuation: () => (
        <ElFormItem label="大小衰减">
          <ElCheckbox v-model={formData.value.sizeAttenuation} onChange={() => change('sizeAttenuation')} />
        </ElFormItem>
      ),
      depthTest: () => (
        <ElFormItem label="深度测试">
          <ElCheckbox v-model={formData.value.depthTest} onChange={() => change('depthTest')} />
        </ElFormItem>
      ),
      depthWrite: () => (
        <ElFormItem label="深度缓冲">
          <ElCheckbox v-model={formData.value.depthWrite} onChange={() => change('depthWrite')} />
        </ElFormItem>
      ),
      wireframe: () => (
        <ElFormItem label="线框">
          <ElCheckbox v-model={formData.value.wireframe} onChange={() => change('wireframe')} />
        </ElFormItem>
      )
    };
    const renderContent = (type) => {
      const html = [];
      materialType[type]?.forEach((key) => {
        if (!renderHtml[key]) return;
        html.push(renderHtml[key]());
      });
      return html;
    };
    return () => {
      return <>{renderContent(formData.value.type)}</>;
    };
  }
});
