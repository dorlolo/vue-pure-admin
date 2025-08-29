<script setup lang="ts">
import { ref, onMounted, defineProps, computed, watch } from "vue";
import {
  ProductSalesType,
  getProductSalesList,
  createProductSales,
  updateProductSales
} from "@/api/productSalesApi";
import { HandleResponseCode } from "@/api/utils";
import { getMeasureUnitList } from "@/api/productMeasureUnitApi";
import {
  ProductMeasureUnitType,
  createProductMeasureUnit,
  updateProductMeasureUnit,
  deleteProductMeasureUnit
} from "@/api/productMeasureUnitRelApi";
import { getCurrencyList } from "@/api/productCurrencyApi";

const talkPops = defineProps({
  //存储数据的变量名，自定义
  productId: { type: Number, required: true },
  productType: { type: Number, required: false }
  // cancelEdit: { type: Boolean, required: false }
});
const inputValue = ref({
  productId: 0,
  productType: 3
});
watch(
  () => talkPops.productId,
  newVal => {
    inputValue.value.productId = newVal ? Number(newVal) : 0;
    onSearch(inputValue.value.productId);
  }
);
watch(
  () => talkPops.productType,
  newVal => {
    inputValue.value.productType = newVal ? Number(newVal) : 0;
    console.log("inputValue.value.productType", inputValue.value.productType);
  }
);
const formData = ref<
  ProductSalesType & {
    unitPriceNum: number;
  }
>({
  id: 0,
  productId: inputValue.value.productId,
  measureUnitList: [],
  calculateUnitId: 0,
  unitPriceNum: 0,
  unitPrice: "0"
});
function initFormData() {
  formData.value = {
    id: 0,
    productId: inputValue.value.productId,
    measureUnitList: [],
    calculateUnitId: 0,
    unitPriceNum: 0,
    unitPrice: "0"
  };
}
// ---------------------------------度量单位选择---------------------------
// 度量单位下拉框列表数据
const measureUnitSelectItems = ref([]);
const measureUnitOriginData = ref([]);
// 初始化 度量单位 下拉框列表数据
const initMeasureUnitList = async () => {
  const res = await getMeasureUnitList({ page: 1, pageSize: -1 });
  if (!HandleResponseCode(res, true)) {
    return;
  }
  measureUnitOriginData.value = res.list;
  measureUnitSelectItems.value = [];
  const groupedUnits = {};
  res.list.forEach(item => {
    const groupName = item.groupName || "默认";
    if (!groupedUnits[groupName]) {
      groupedUnits[groupName] = {
        value: groupName,
        label: groupName,
        children: []
      };
    }
    groupedUnits[groupName].children.push({
      value: item.id,
      label: item.name
    });
  });
  measureUnitSelectItems.value = Object.values(groupedUnits);
};
// 下拉框度量单位选择时间
const onChangeMeasureUnitSelect = () => {
  formData.value.measureUnitList.forEach(item => {
    const selectUnitId = item.mesaureUnitSelectValue[1];
    if (item.unitId !== selectUnitId) {
      item.unitId = selectUnitId;
    }
  });
};
// 度量单位id转换为下拉框选项
const convertToSelectValue = (unitId: number) => {
  const unit = measureUnitOriginData.value.find(unit => unit.id === unitId);
  if (unit === undefined) {
    return [];
  }
  return [unit.groupName, unit.id];
};

// 度量单位字符串拼接
const joinMeasuerUnit = computed(() => {
  let str = "";
  if (formData.value.measureUnitList.length === 0) {
    return "";
  } else if (measureUnitOriginData.value.length === 0) {
    return "";
  }
  formData.value.measureUnitList.forEach(item => {
    const thisUnit = measureUnitOriginData.value.find(
      unit => unit.id === item.unitId
    );
    if (thisUnit === undefined) {
      return "";
    }
    str +=
      item.prefix +
      String(item.factor ? item.factor : "") +
      thisUnit.name +
      item.suffix;
  });
  return str;
});
// 使用unitId获取度量单位名称
const thisMeasureUnitName = (unitId: number) => {
  const thisUnit = measureUnitOriginData.value.find(unit => unit.id === unitId);
  if (thisUnit === undefined) {
    return "";
  }
  return thisUnit.name;
};
// const hasCalculateMeasureUnit = computed(() => {
//   formData.value.measureUnitList.forEach(item => {
//     if (item.enableCalculate) {
//       return true;
//     }
//   });
//   return false;
// });
// ---------------------------------货币类型选择---------------------------
const currencySelect = ref<{
  selectList: any;
  originData: any;
  selectNameList: any;
  selfDefine: Boolean;
}>({
  selectList: [],
  originData: [],
  selectNameList: [],
  selfDefine: false
});
const initCurrencySelectList = async () => {
  const res = await getCurrencyList();
  if (!HandleResponseCode(res, true)) {
    return;
  }
  currencySelect.value.originData = res.list;
  currencySelect.value.selectList = [];
  res.list.forEach(item => {
    currencySelect.value.selectList.push({
      value: item.id,
      label: item.code + "-" + item.name
    });
  });
};

const onCurrencyChange = () => {
  console.log("formData.value.currencyId", formData.value.currencyId);
  const currency = currencySelect.value.originData.find(
    item => item.id === formData.value.currencyId
  );
  console.log("1111111111");
  if (currency === undefined) {
    currencySelect.value.selfDefine = true;
    return;
  }
  console.log("22222222");
  formData.value.currency = currency;
  currencySelect.value.selectNameList = [
    { value: currency.cnUnit, label: currency.cnUnit },
    { value: currency.unit, label: currency.unit },
    { value: currency.code, label: currency.code },
    { value: currency.name, label: currency.name }
  ];
};
// ---------------------------------提交表单---------------------------
const onSubmitForm = async () => {
  formData.value.unitPrice = String(formData.value.unitPriceNum);
  if (formData.value.id === 0) {
    const res = await createProductSales(formData.value);
    if (!HandleResponseCode(res)) {
      return;
    }
  } else {
    const res = await updateProductSales(formData.value);
    if (!HandleResponseCode(res)) {
      return;
    }
  }
};

const onSearch = async (productId: number) => {
  console.log("productSalesForm onSearch productId", productId);
  const res = await getProductSalesList({
    productId: productId,
    page: 1,
    pageSize: 1
  });
  if (!HandleResponseCode(res)) {
    return;
  }
  if (res.pageInfo.total > 0) {
    formData.value = res.list[0];
    console.log("onSearch currencyId", formData.value.currencyId);
    formData.value.unitPriceNum = parseFloat(res.list[0].unitPrice);
    // 度量单位转为下拉框选项
    if (formData.value.measureUnitList.length > 0) {
      formData.value.measureUnitList.forEach(item => {
        item.mesaureUnitSelectValue = convertToSelectValue(item.unitId);
      });
    }
    if (formData.value.currencyId !== 0) {
      onCurrencyChange();
    }
  } else {
    initFormData();
  }
};
const onAdddProductRelMeasureUnit = () => {
  formData.value.measureUnitList.push({
    productId: inputValue.value.productId,
    salesId: formData.value.id,
    id: 0,
    enableCalculate: false,
    sort: 0,
    factor: 0,
    precision: 0,
    prefix: "",
    suffix: ""
  });
};
const onSaveProductRelMeasureUnit = async (row: ProductMeasureUnitType) => {
  if (
    row.productId === 0 ||
    row.productId == null ||
    row.productId == undefined
  ) {
    console.log("productId 为0，改为", inputValue.value.productId);
    formData.value.productId = inputValue.value.productId;
  }
  if (formData.value.id === 0) {
    const res = await createProductSales(formData.value);
    if (!HandleResponseCode(res)) {
      return;
    }
  } else if (row.id === 0) {
    const res = await createProductMeasureUnit(row);
    if (!HandleResponseCode(res)) {
      return;
    }
  } else {
    row.salesId = formData.value.id;
    const res = await updateProductMeasureUnit(row);
    if (!HandleResponseCode(res)) {
      return;
    }
  }
  onSearch(inputValue.value.productId);
};
const onDeleteProductRelMeasureUnit = async (row: ProductMeasureUnitType) => {
  const res = await deleteProductMeasureUnit({
    productId: row.productId,
    unitId: row.unitId
  });
  if (!HandleResponseCode(res)) {
    return;
  }
  onSearch(inputValue.value.productId);
};
const fackProductNum = ref(1);
const showFackNumInput = computed(() => {
  let showInput = false;
  if (formData.value.num > 0) {
    showInput = false;
  } else {
    formData.value.measureUnitList.forEach(item => {
      if (item.enableCalculate) {
        showInput = true;
      }
    });
  }
  return showInput;
});
// 商品数量选择时间
const onNumChange = () => {
  if (formData.value.num === 0) {
    fackProductNum.value = 1;
  } else {
    fackProductNum.value = formData.value.num;
  }
};
const calculateFinalPrice = () => {
  return fackProductNum.value * formData.value.unitPriceNum;
};
onMounted(async () => {
  console.log("产品销售页面加载...");
  inputValue.value.productId = talkPops.productId;
  initMeasureUnitList();
  initCurrencySelectList();
  onSearch(inputValue.value.productId);
});
</script>

<template>
  <div @click.stop>
    <div>
      <div class="titleContainer">
        <div>
          <span>度量单位</span>
          <span style="margin-left: 5px; color: brown">{{
            joinMeasuerUnit
          }}</span>
          <span
            >（默认情况，最终量=因数1。勾选【启用计算】后，最终量=因数1*因数2）</span
          >
        </div>
        <div class="titleButton">
          <el-button type="primary" @click="onAdddProductRelMeasureUnit"
            >添加</el-button
          >
        </div>
      </div>
      <div class="tableContainer">
        <el-table :data="formData.measureUnitList" style="width: 100%">
          <el-table-column label="单位类型" header-align="center">
            <template #default="{ row }">
              <el-cascader
                v-model="row.mesaureUnitSelectValue"
                :options="measureUnitSelectItems"
                @change="onChangeMeasureUnitSelect"
              />
            </template>
          </el-table-column>
          <el-table-column label="因数1" header-align="center">
            <template #default="{ row }">
              <div class="columnContainer">
                <el-input-number v-model="row.factor" :min="0" />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="启用计算" header-align="center">
            <template #default="{ row }">
              <div class="columnContainer">
                <el-checkbox v-model="row.enableCalculate" size="large" />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="因数2"
            header-align="center"
            v-if="inputValue.productType === 3"
          >
            <template #default="{ row }">
              <div class="columnContainer">
                <el-switch
                  v-model="row.packFollowParentNum"
                  active-text="父级数量"
                  inactive-text="自己数量"
                  :active-value="1"
                  :inactive-value="2"
                  :disabled="!row.enableCalculate"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="最终量小数精度" header-align="center">
            <template #default="{ row }">
              <div class="columnContainer">
                <el-input-number
                  v-model="row.precision"
                  :min="0"
                  :disabled="!row.enableCalculate"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="排序" header-align="center">
            <template #default="{ row }">
              <div class="columnContainer">
                <el-input-number v-model="row.sort" :min="0" />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="前缀" header-align="center">
            <template #default="{ row }">
              <div class="columnContainer">
                <el-input v-model="row.prefix" />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="后缀" header-align="center">
            <template #default="{ row }">
              <div class="columnContainer">
                <el-input v-model="row.suffix" />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" header-align="center">
            <template v-slot="{ row }">
              <div class="spaceContainer">
                <div @click.stop class="btn">
                  <el-button
                    type="warning"
                    @click="onSaveProductRelMeasureUnit(row)"
                    >保存</el-button
                  >
                </div>
                <div @click.stop class="btn">
                  <el-button
                    type="danger"
                    @click="onDeleteProductRelMeasureUnit(row)"
                    >删除</el-button
                  >
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div>
      <el-form :model="formData" label-width="120px">
        <div class="titleContainer">
          <div>价格配置</div>
          <!-- {{ joinMeasuerUnit }} -->
          <div class="fakeContainer">
            <div class="fakeCell" style="background-color: #2ff111">
              <span>单价/内容: </span>

              <span class="activeFakeField">{{ formData.unitPriceNum }}</span>
              <span>{{ formData.currencyUnit }}</span>

              <div v-for="unit in formData.measureUnitList" :key="unit.id">
                <span>{{ unit.prefix }}</span>
                <span v-if="unit.enableCalculate" class="activeFakeField">{{
                  unit.factor
                }}</span>
                <span v-else-if="unit.factor > 0">{{ unit.factor }}</span>
                <span>{{ thisMeasureUnitName(unit.unitId) }}</span>
                <span>{{ unit.suffix }}</span>
              </div>
            </div>
            <div class="fakeCell" style="background-color: lightgreen">
              <span>测试购买数量：</span>
              <el-input-number
                v-model="fackProductNum"
                :min="1"
                :disabled="!showFackNumInput"
              />
            </div>
            <div class="fakeCell" style="background-color: aquamarine">
              <span>最终价格:</span>
              <!-- <span> {{ fackProductNum }} </span>
              <span> * {{ formData.unitPriceNum }} </span>
              <span> = </span> -->
              <span class="activeFakeField">{{ calculateFinalPrice() }}</span>
              <span>{{ formData.currencyUnit }}</span>
              <div v-for="unit in formData.measureUnitList" :key="unit.id">
                <span>{{ unit.prefix }}</span>
                <span v-if="unit.enableCalculate" class="activeFakeField">{{
                  unit.factor * fackProductNum
                }}</span>
                <span v-else-if="unit.factor > 0">{{ unit.factor }}</span>
                <span>{{ thisMeasureUnitName(unit.unitId) }}</span>
                <span>{{ unit.suffix }}</span>
              </div>
            </div>
          </div>
        </div>
        <el-form-item label="货币类型" style="width: 20%">
          <el-select
            v-model="formData.currencyId"
            placeholder="请选择货币类型"
            @change="onCurrencyChange"
          >
            <el-option
              v-for="currency in currencySelect.selectList"
              :key="currency.value"
              :label="currency.label"
              :value="currency.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="货币单位" style="width: 30%">
          <div style="display: flex; align-items: center">
            <el-select
              v-model="formData.currencyUnit"
              placeholder="请选择货币单位"
              v-if="!currencySelect.selfDefine"
            >
              <el-option
                v-for="currency in currencySelect.selectNameList"
                :key="currency.value"
                :label="currency.label"
                :value="currency.value"
              />
            </el-select>
            <el-input
              v-else
              v-model="formData.currencyUnit"
              placeholder="请输入货币名称"
            />
            <el-checkbox
              v-model="currencySelect.selfDefine"
              size="large"
              style="margin-left: 10px"
              >自定义</el-checkbox
            >
          </div>
        </el-form-item>
        <el-form-item label="单价" style="width: 20%">
          <el-input-number
            v-model="formData.unitPriceNum"
            :min="0"
            :precision="
              formData.currency && formData.currency.decimalPlaces !== undefined
                ? formData.currency.decimalPlaces
                : 2
            "
            placeholder="请输入单价"
          />
        </el-form-item>
        <el-form-item
          label="计价方式(todo)"
          v-if="inputValue.productType === 1 || inputValue.productType === 2"
        >
          <div>
            <el-radio-group v-model="formData.calcWay" :disabled="true">
              <el-radio label="1">一口价</el-radio>
              <el-radio label="2">子项累加</el-radio>
              <el-radio label="3"
                >混合(在一口价基础上进行子项价格累加)</el-radio
              >
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item label="数量" style="width: 30%">
          <div style="display: flex">
            <el-input-number
              v-model="formData.num"
              :min="0"
              @input="onNumChange"
            />
            <span
              v-if="formData.num === 0"
              style="margin-left: 10px; color: red"
              >用户可通过订单修改</span
            >
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmitForm">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.titleContainer {
  display: flex;
  align-items: center;
  margin: 0 25px 15px 15px;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 2px solid #409eff;
}

.measureUnitItem {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.titleButton {
  padding: 0.2%;
  margin-left: auto;
}

.tableContainer {
  min-width: 800px;
  padding: 0 15px;
  margin-bottom: 30px;
}

.columnContainer {
  display: flex;
  justify-content: center;
  margin: 0 auto;
}

.spaceContainer {
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn {
  margin-right: 4px;
}

.selectItem {
  width: 150px;
  margin: 0 auto;
}

.fakeContainer {
  display: flex;
  align-items: center; /* Add this line */
  padding: 0 15px;
  margin: 0 15px;
}

.fakeCell {
  display: flex;
  align-items: center; /* Add this line */
  margin-right: 20px;
}

.activeFakeField {
  padding: 0 10px;
  color: #1d1d1d;
  background-color: rgb(219 252 100);
}

.activeFakeLabel {
  padding: 0 15px;
  color: #f2f2f2;
  background-color: rgb(247 157 68);
}
</style>
