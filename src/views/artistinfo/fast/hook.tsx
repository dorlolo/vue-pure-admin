import { execFastCommand } from "@/api/artistinfo";
import { HandleResponseCode } from "@/api/utils";
import { ref } from "vue";
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
      label: "设置短信验证码",
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
      label: "更换手机号",
      color: "green", // 你可以替换为其他颜色值，如 "#2ecc71"
      bg: "#e7a400", // 你可以替换为其他颜色值，如 "#98fb98"
      cmd: "replacePhone",
      form: [
        {
          label: "原手机号",
          key: "phone1",
          placeHolder: "必填，请输入原手机号"
        },
        {
          label: "修改为",
          key: "phone2",
          placeHolder: "必填，请输入修改的手机号"
        }
      ]
    },
    {
      label: "完整删除账号",
      color: "#e832ff", // 你可以替换为其他颜色值，如 "#2ecc71"
      bg: "lightgreen", // 你可以替换为其他颜色值，如 "#98fb98"
      cmd: "user_delete",
      form: [
        {
          label: "姓名",
          key: "realName"
        },
        {
          label: "手机号码",
          key: "phone"
        }
      ]
    },
    {
      label: "添加经纪人",
      color: "#e832ff", // 你可以替换为其他颜色值，如 "#2ecc71"
      bg: "lightgreen", // 你可以替换为其他颜色值，如 "#98fb98"
      cmd: "create_agent",
      form: [
        {
          label: "姓名",
          key: "realName"
        },
        {
          label: "手机号码",
          key: "phone"
        }
      ]
    },
    {
      label: "更新低优先级画家",
      color: "#e832ff", // 你可以替换为其他颜色值，如 "#2ecc71"
      bg: "lightgreen", // 你可以替换为其他颜色值，如 "#98fb98"
      cmd: "create_agent",
      form: []
    },
    {
      label: "清除画家画作",
      color: "#3498db", // 修改为新的颜色
      bg: "lightblue", // 修改为新的背景颜色
      cmd: "clear_artwork",
      form: [
        {
          label: "画家uid",
          key: "artistUid"
        },
        {
          label: "锁定状态（所有则为0）",
          key: "lockStatus"
        }
      ]
    },
    {
      label: "同步本地的版权登记委托书",
      color: "#9b59b6",
      bg: "lightpink",
      cmd: "SyncCopyrightContractFromFile",
      form: [
        {
          label: "画作泰丰编号（不传则更新所有）",
          key: "tfnum"
        }
      ]
    },
    {
      label: "发送app通知",
      color: "#f5f5f5",
      bg: "#303f9f",
      cmd: "send_app_notice",
      form: [
        {
          label: "手机号",
          key: "phone",
          placeHolder: "多个手机号使用逗号间隔"
        },
        {
          label: "title",
          key: "title",
          placeHolder: "选填"
        },
        {
          label: "alert",
          key: "alert",
          placeHolder: "选填"
        },
        {
          label: "安卓Intent",
          key: "androidIntent",
          placeHolder: "选填"
        }
      ]
    },
    {
      label: "检测用户身份信息",
      color: "green", // 你可以替换为其他颜色值，如 "#2ecc71"
      bg: "lightgreen", // 你可以替换为其他颜色值，如 "#98fb98"
      cmd: "verify_artist_id_card",
      form: [
        {
          label: "tnum",
          key: "tnum",
          placeHolder: "选填注意：此脚本只支持生产环境"
        },
        {
          label: "初始用户id",
          key: "id",
          placeHolder: "选填,从哪个用户id开始查询"
        }
      ]
    },
    {
      label: "同步第三方版权登记审批状态",
      color: "green", // 你可以替换为其他颜色值，如 "#2ecc71"
      bg: "lightgreen", // 你可以替换为其他颜色值，如 "#98fb98"
      cmd: "SyncCopyrightStatus",
      form: [
        {
          label: "crUid",
          key: "crUid",
          placeHolder: "选填，为空则更新所有"
        }
      ]
    },
    {
      label: "每批次合同的artworkUid同步到合同类型1",
      color: "green", // 你可以替换为其他颜色值，如 "#2ecc71"
      bg: "lightgreen", // 你可以替换为其他颜色值，如 "#98fb98"
      cmd: "updateType1ContractArtworkUid",
      form: []
    },
    {
      label: "合同artworkUid和lockTime为空的数据进行优化",
      color: "green", // 你可以替换为其他颜色值，如 "#2ecc71"
      bg: "lightgreen", // 你可以替换为其他颜色值，如 "#98fb98"
      cmd: "ContractLockTimeAndArtworkUidSupplyment",
      form: []
    },
    {
      label: "清除重复的画家视频",
      color: "orange",
      bg: "whitesmoke",
      cmd: "CLEAR_REPETITIVE_VIDEOS",
      form: []
    },
    {
      label: "更新画家系统没有指数的画家",
      color: "white",
      bg: "black",
      cmd: "UpdateIndexOfArtistSystemWhichIsEmpty",
      form: []
    }
    // {
    //   label: "撤回画作补充信息",
    //   color: "red", // 你可以替换为其他颜色值，如 "#e74c3c"
    //   bg: "lightcoral", // 你可以替换为其他颜色值，如 "#f08080"
    //   cmd: "recover_artwork_supply_info",
    //   form: []
    // }
    // {
    //   label: "用户快速注册",
    //   color: "green", // 你可以替换为其他颜色值，如 "#2ecc71"
    //   bg: "lightgreen", // 你可以替换为其他颜色值，如 "#98fb98"
    //   cmd: "user_register",
    //   form: []
    // },
    // {
    //   label: "撤回画作补充信息",
    //   color: "red", // 你可以替换为其他颜色值，如 "#e74c3c"
    //   bg: "lightcoral", // 你可以替换为其他颜色值，如 "#f08080"
    //   cmd: "recover_artwork_supply_info",
    //   form: []
    // }
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
    const data: { cmd: string; env: number; form: Record<string, any> } = { cmd: '', env: 0, form: {} };
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
    const resposne = await execFastCommand(data);
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
