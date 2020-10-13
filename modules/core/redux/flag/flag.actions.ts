import FlagActionTypes from "./flag.types";

export const dismissFlag = () => ({
    type: FlagActionTypes.DISMISS_FLAG
})

export const passwordChangeSuccessFlag = () => ({
    type: FlagActionTypes.CHANGE_PASSWORD_SUCCESS,
    payload: {
        type: FlagActionTypes.CHANGE_PASSWORD_SUCCESS
    }
})

export const passwordChangeErrorFlag = (e) => ({
    type: FlagActionTypes.CHANGE_PASSWORD_ERROR,
    payload: {
        type: FlagActionTypes.CHANGE_PASSWORD_ERROR,
        error: e
    }
})

export const assignmentCreatedFlag = (flagType: 'error' | 'success', title: string, description = "") => ({
    type: FlagActionTypes.ASSIGNMENT_CREATED_MSG,
    payload: {
        type: FlagActionTypes.ASSIGNMENT_CREATED_MSG,
        title: flagType === 'error' ? null : title,
        error: flagType === 'error' ? title : null,
        description: description
    }
});