import React from "react";
import { useDispatch } from "react-redux";

import { AutoDismissFlag, FlagProps, ActionsType } from "@atlaskit/flag";
import ErrorIcon from "@atlaskit/icon/glyph/error";
import { R400 } from "@atlaskit/theme/colors";

import { dismissFlag } from "../../../modules/core/redux/flag/flag.actions";

const PasswordChangeErrorFlag = (props: any) => {
  const dispatch = useDispatch();
  const dispatchDismissFlag = () => dispatch(dismissFlag());

  const Actions: ActionsType = [
    {
      content: "Ok",
      onClick: dispatchDismissFlag,
    },
  ];

  const Props: FlagProps = {
    id: props.id,
    appearance: "error",
    icon: <ErrorIcon label="Error" secondaryColor={R400} />,
    title: "Something went wrong while changing password 😞",
    description: `Error: ${props.error}`,
  };

  return <AutoDismissFlag actions={Actions} {...Props} />;
};

export default PasswordChangeErrorFlag;