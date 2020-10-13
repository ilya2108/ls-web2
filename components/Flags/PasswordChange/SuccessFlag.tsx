import React from "react";
import { useDispatch } from "react-redux";

import { AutoDismissFlag, FlagProps, ActionsType } from "@atlaskit/flag";
import SuccessIcon from "@atlaskit/icon/glyph/check-circle";
import { G400 } from "@atlaskit/theme/colors";

import { dismissFlag } from "../../../modules/core/redux/flag/flag.actions";

const PasswordChangeSuccessFlag = (props: any) => {
  const dispatch = useDispatch();
  const dispatchDismissFlag = () => dispatch(dismissFlag());

  const Props: FlagProps = {
    id: props.id,
    appearance: "success",
    icon: <SuccessIcon label="Success" secondaryColor={G400} />,
    title: "Password changed 👌",
  };

  const Actions: ActionsType= [
    {
      content: "Thanks!",
      onClick: dispatchDismissFlag,
    },
  ];

  return <AutoDismissFlag actions={Actions} {...Props} />;
};

export default PasswordChangeSuccessFlag;