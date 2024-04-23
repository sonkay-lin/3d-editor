import { defineComponent } from 'vue';
import { useMaterial } from './useMaterial';

export default defineComponent({
  props: {
    property: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const { property } = props;
    const mapType = property.replace('Map', '');

    const { formData, change } = useMaterial();
    let aoMap, bumpMapAndDisplacementMap, normalMapAndClearcoatNormalMap, iridescenceThicknessMap;
    if (property === 'aoMap') {
      aoMap = () => {
        const intensity = `${property}Intensity`;
        return (
          <>
            <SlideInput
              onlyNumber
              v-model:value={formData.value[intensity]}
              min={0}
              max={1}
              onChange={() => change(intensity)}
            />
          </>
        );
      };
    }

    if (property === 'bumpMap' || property === 'displacementMap') {
      bumpMapAndDisplacementMap = () => {
        const scale = `${mapType}Scale`;
        return (
          <>
            <SlideInput onlyNumber v-model:value={formData.value[scale]} onChange={() => change(scale)} />
          </>
        );
      };
    }

    if (property === 'normalMap' || property === 'clearcoatNormalMap') {
      normalMapAndClearcoatNormalMap = () => {
        const scale = `${mapType}Scale`;
        return (
          <>
            <SlideInput onlyNumber v-model:value={formData.value[scale].x} onChange={() => change(scale)} />
            <SlideInput onlyNumber v-model:value={formData.value[scale].y} onChange={() => change(scale)} />
          </>
        );
      };
    }

    if (property === 'iridescenceThicknessMap') {
      iridescenceThicknessMap = () => {
        const range = `${mapType}Range`
        return (
          <>
            <div>
              <div>
                <span>min:</span>
                <SlideInput
                  onlyNumber
                  v-model:value={formData.value[range][0]}
                  min={0}
                  max={formData.value[range][1] - 1}
                  step={1}
                  precision={0}
                  onChange={() => change(range)}
                />
              </div>
              <div>
                <span>max:</span>
                <SlideInput
                  onlyNumber
                  v-model:value={formData.value[range][1]}
                  min={formData.value[range][0] + 1}
                  step={1}
                  precision={0}
                  onChange={() => change(range)}
                />
              </div>
            </div>
          </>
        );
      };
    }

    const content = {
      aoMap: aoMap,
      bumpMap: bumpMapAndDisplacementMap,
      displacementMap: bumpMapAndDisplacementMap,
      normalMap: normalMapAndClearcoatNormalMap,
      clearcoatNormalMap: normalMapAndClearcoatNormalMap,
      iridescenceThicknessMap: iridescenceThicknessMap
    };

    return () => {
      return <>{content[property]?.()}</>;
    };
  }
});
