import React from "react";
import { useRouter } from "next/router";

import { default as AKFlag, FlagProps, ActionsType } from "@atlaskit/flag";

import WarningIcon from "@atlaskit/icon/glyph/warning";
import { Y200 } from "@atlaskit/theme/colors";

const ConnectionIssuesFlag = (props) => {
  const router = useRouter();

  const Actions: ActionsType = [
    {
      content: "Try again",
      onClick: router.reload,
    }
  ];

  const Props: FlagProps = {
    id: props.id,
    appearance: "warning",
    icon: <WarningIcon label="Warning" secondaryColor={Y200} />,
    title: "Having trouble connecting…",
    description:
      "We’re running into some difficulties connecting to HQ right now."
  };

  return <AKFlag {...Props} actions={Actions} />;
};

export default ConnectionIssuesFlag;