import { computed, defineComponent, ref } from 'vue';
import { useGeometry } from './useGeometry';
import { geometryType } from './GeometryParameter';
import { ElFormItem, ElInput, ElCheckbox } from 'element-plus'
import SlideInput from '@/components/common/SlideInput.vue';

export default defineComponent({
  props: { SlideInput },
  setup() {
    const { formData, _geometryType, change } = useGeometry();
    const renderItem = {
      uuid: () => (
        <ElFormItem label="识别码">
          <ElInput v-model={formData.value.uuid} />
        </ElFormItem>
      ),
      name: () => (
        <ElFormItem label="名称">
          <ElInput v-model={formData.value.name}  onChange={() => change('name')}/>
        </ElFormItem>
      ),
      width: () => (
        <ElFormItem label="宽度">
          <SlideInput v-model:value={formData.value.width} onChange={change} />
        </ElFormItem>
      ),
      height: () => (
        <ElFormItem label="高度">
          <SlideInput v-model:value={formData.value.height} onChange={change} />
        </ElFormItem>
      ),
      depth: () => (
        <ElFormItem label="深度">
          <SlideInput v-model:value={formData.value.depth} onChange={change} />
        </ElFormItem>
      ),
      widthSegments: () => (
        <ElFormItem label="宽度分段">
          <SlideInput v-model:value={formData.value.widthSegments} min={1} step={1} precision={0} onChange={change} />
        </ElFormItem>
      ),
      heightSegments: () => (
        <ElFormItem label="高度分段">
          <SlideInput v-model:value={formData.value.heightSegments} min={1} step={1} precision={0} onChange={change} />
        </ElFormItem>
      ),
      depthSegments: () => (
        <ElFormItem label="深度分段">
          <SlideInput v-model:value={formData.value.depthSegments} min={1} step={1} precision={0} onChange={change} />
        </ElFormItem>
      ),
      radius: () => (
        <ElFormItem label="半径">
          <SlideInput v-model:value={formData.value.radius} onChange={change} />
        </ElFormItem>
      ),
      length: () => (
        <ElFormItem label="长度">
          <SlideInput v-model:value={formData.value.length} onChange={change} />
        </ElFormItem>
      ),
      capSegments: () => (
        <ElFormItem label="胶囊分段">
          <SlideInput v-model:value={formData.value.capSegments} step={1} precision={0} onChange={change} />
        </ElFormItem>
      ),
      segments: () => (
        <ElFormItem label="分段">
          <SlideInput v-model:value={formData.value.segments} min={1} step={1} precision={0} onChange={change} />
        </ElFormItem>
      ),
      radialSegments: () => (
        <ElFormItem label="半径分段">
          <SlideInput v-model:value={formData.value.radialSegments} min={1} step={1} precision={0} onChange={change} />
        </ElFormItem>
      ),
      thetaSegments: () => (
        <ElFormItem label="弧度分段">
          <SlideInput v-model:value={formData.value.thetaSegments} min={1} step={1} precision={0} onChange={change} />
        </ElFormItem>
      ),
      thetaStart: () => (
        <ElFormItem label="弧度起点">
          <SlideInput v-model:value={formData.value.thetaStart} onChange={change} />
        </ElFormItem>
      ),
      thetaLength: () => (
        <ElFormItem label="弧度长度">
          <SlideInput v-model:value={formData.value.thetaLength} onChange={change} />
        </ElFormItem>
      ),
      radiusTop: () => (
        <ElFormItem label="顶部半径">
          <SlideInput v-model:value={formData.value.radiusTop} onChange={change} />
        </ElFormItem>
      ),
      radiusBottom: () => (
        <ElFormItem label="底部半径">
          <SlideInput v-model:value={formData.value.radiusBottom} onChange={change} />
        </ElFormItem>
      ),
      openEnded: () => (
        <ElFormItem label="开端">
          <ElCheckbox v-model={formData.value.openEnded} onChange={change} />
        </ElFormItem>
      ),
      detail: () => (
        <ElFormItem label="面片分段">
          <SlideInput v-model:value={formData.value.detail} min={0} step={1} precision={0}  onChange={change} />
        </ElFormItem>
      ),
      phiStart: () => (
        <ElFormItem label="经度起点">
          <SlideInput v-model:value={formData.value.phiStart} onChange={change} />
        </ElFormItem>
      ),
      phiLength: () => (
        <ElFormItem label="经度长度">
          <SlideInput v-model:value={formData.value.phiLength} onChange={change} />
        </ElFormItem>
      ),
      innerRadius: () => (
        <ElFormItem label="内半径">
          <SlideInput v-model:value={formData.value.innerRadius} onChange={change} />
        </ElFormItem>
      ),
      outerRadius: () => (
        <ElFormItem label="外半径">
          <SlideInput v-model:value={formData.value.outerRadius} onChange={change} />
        </ElFormItem>
      ),
      phiSegments: () => (
        <ElFormItem label="经度分段">
          <SlideInput v-model:value={formData.value.phiSegments} min={1} step={1} precision={0} onChange={change} />
        </ElFormItem>
      ),
      tube: () => (
        <ElFormItem label="管道半径">
          <SlideInput v-model:value={formData.value.tube} onChange={change} />
        </ElFormItem>
      ),
      tubularSegments: () => (
        <ElFormItem label="管道分段">
          <SlideInput v-model:value={formData.value.tubularSegments} min={1} step={1} precision={0} onChange={change} />
        </ElFormItem>
      ),
      arc: () => (
        <ElFormItem label="弧度">
          <SlideInput v-model:value={formData.value.arc} onChange={change} />
        </ElFormItem>
      ),
      p: () => (
        <ElFormItem label="管长弧度">
          <SlideInput v-model:value={formData.value.p} onChange={change} />
        </ElFormItem>
      ),
      q: () => (
        <ElFormItem label="扭曲弧度">
          <SlideInput v-model:value={formData.value.q} onChange={change} />
        </ElFormItem>
      ),
      closed: () => (
        <ElFormItem label="闭合">
          <ElCheckbox v-model={formData.value.closed} onChange={change} />
        </ElFormItem>
      ),
      // TODO:后续补上
      // points: () => <ElFormItem label="点"></ElFormItem>,
      // path: () => <ElFormItem label="路径"></ElFormItem>,

      // attributes: () => <ElFormItem label="属性"></ElFormItem>,
      // bounds: () => <ElFormItem label="界限"></ElFormItem>
    };

    const renderContent = (type) => {
      const html = [];
      geometryType[type]?.forEach((key) => {
        if (!renderItem[key]) return;
        html.push(renderItem[key]());
      });
      return html;
    };

    return () => {
      return <>{renderContent(_geometryType.value)}</>;
    };
  }
});
