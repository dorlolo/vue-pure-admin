import { ref } from "vue";
import { execAuctionFastCommand } from "@/api/artistinfo";
import { HandleResponseCode } from "@/api/utils";
type cardType = {
  label: string;
  color: string;
  bg: string;
  cmd: string;
  form: Array<formType>;
};
type formType = {
  label: string;
  key: string;
  placeHolder?: string;
  cmd?: string;
  value?: string;
};
export function useFast() {
  const cardList: cardType[] = [
    {
      label: "设置拍卖客户端短信验证码",
      color: "blue", // 你可以替换为其他颜色值，如 "#3498db"
      bg: "lightblue", // 你可以替换为其他颜色值，如 "#87cefa"
      cmd: "sms_verification_code",
      form: [
        {
          label: "手机号码",
          key: "phone"
        },
        {
          label: "验证码",
          key: "code"
        },
        {
          label: "有效时间",
          key: "expire",
          placeHolder: "单位：分，不填表示永不过期"
        }
      ]
    },
    {
      label: "为线下支付二维码生成基础数据",
      color: "green", // 你可以替换为其他颜色值，如 "#2ecc71"
      bg: "#e7a400", // 你可以替换为其他颜色值，如 "#98fb98"
      cmd: "generate_test_data",
      form: [
        {
          label: "数量",
          key: "num",
          placeHolder: "生成的待支付画作数量"
        }
      ]
    },
    {
      label: "Excel导入线下号牌数据",
      color: "#e832ff", // 你可以替换为其他颜色值，如 "#2ecc71"
      bg: "lightgreen", // 你可以替换为其他颜色值，如 "#98fb98"
      cmd: "upload_user_and_session_no",
      form: [
        {
          label: "文件路径",
          key: "path"
        },
        {
          label: "清空号牌表",
          key: "clear_auction_session_user_no",
          placeHolder: "1是 2否(默认)。注意：不清空的话可能会有重复号牌"
        }
      ]
    },
    {
      label: "series表生成模拟数据",
      color: "#e832ff",
      bg: "#e7eeff",
      cmd: "gen_fenghe_series_model_data",
      form: [
        {
          label: "生成数量",
          key: "total"
        }
      ]
    },
    {
      label: "[丰和]导入下线领号牌用户",
      color: "#e81eff",
      bg: "#f7f1ff",
      cmd: "upload_fenghe_session_no",
      form: [
        {
          label: "文件路径",
          key: "path",
          value: "D:\\jjxu\\work\\丰和\\拍卖注册.xlsx"
        },
        { label: "拍卖uid", key: "auctionUid" },
        { label: "清空该拍卖用户", key: "clear", placeHolder: "true/false" }
      ]
    }
  ];
  const dialogForm = ref({
    ////展示表单
    dialogFormVisible: false,
    ////formData表单中的数据，和table中的一样要与prop进行关联
    formData: ref({} as cardType)
  });

  //提交表单
  async function confirm(cmdData: cardType, env: number) {
    console.log("cmdData", cmdData);
    console.log("cmdData.form", cmdData.form);
    const data = { form: {} };
    data.cmd = cmdData.cmd;
    data.env = env;
    for (let i = 0; i < cmdData.form.length; i++) {
      console.log(
        "key:",
        cmdData.form[i].key,
        "  value:",
        cmdData.form[i].value
      );
      data.form[cmdData.form[i].key] = cmdData.form[i].value;
      // data.form["12"] = cmdData.form[i].value;
    }
    const resposne = await execAuctionFastCommand(data);
    if (HandleResponseCode(resposne)) {
      dialogForm.value.dialogFormVisible = false;
    }
  }
  return {
    cardList,
    dialogForm,
    confirm
  };
}
