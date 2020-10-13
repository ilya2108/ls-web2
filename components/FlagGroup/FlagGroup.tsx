import React from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  FlagGroup as AKFlagGroup,
} from "@atlaskit/flag";

import FlagActionTypes from "../../modules/core/redux/flag/flag.types";
import { dismissFlag } from "../../modules/core/redux/flag/flag.actions";
import PasswordChangeSuccessFlag from "../../components/Flags/PasswordChange/SuccessFlag";
import PasswordChangeErrorFlag from "../../components/Flags/PasswordChange/ErrorFlag";

const FlagGroup = () => {
  const { flags } = useSelector((state) => state.flagGroup);
  const dispatch = useDispatch();
  const dispatchDismissFlag = () => dispatch(dismissFlag());

  return (
    <AKFlagGroup onDismissed={dispatchDismissFlag}>
      {flags.map((flag) =>
        {
          const { type, key, id } = flag;
          switch (type) {
            case FlagActionTypes.CHANGE_PASSWORD_SUCCESS:
              return (
                <PasswordChangeSuccessFlag id={id} key={key}/>
              )
            case FlagActionTypes.CHANGE_PASSWORD_ERROR:
              return (
                <PasswordChangeErrorFlag id={id} key={key} error={flag.error}/>
              )
          }
        }
      )}
    </AKFlagGroup>
  );
};

export default FlagGroup;