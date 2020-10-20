
export function isAdmin(userMyself: any) {
  return (
    userMyself && (
      userMyself.coursesAsTeacher?.totalCount >= 1 ||
      userMyself.isStaff ||
      userMyself.isSuperuser
    )
  )
}
