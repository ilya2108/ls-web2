import React from "react";
import { useDispatch } from "react-redux";

import { AutoDismissFlag, FlagProps, ActionsType } from "@atlaskit/flag";
import ErrorIcon from "@atlaskit/icon/glyph/error";
import { R400 } from "@atlaskit/theme/colors";

import { dismissFlag } from "../../../modules/core/redux/flag/flag.actions";

const AssignmentCreatedErrorFlag = (props: any) => {
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
    title: props.error,
    description: props.description
  };

  return <AutoDismissFlag actions={Actions} {...Props} />;
};

export default AssignmentCreatedErrorFlag;