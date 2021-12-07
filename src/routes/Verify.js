import { authService } from "fbase";
import React, { useEffect, useState } from "react";

function Verify({match}) {
  const uid = match.params.key1;
  const user = authService.currentUser;

  const is_verfied = ( user && user.uid === uid && user.emailVerified);
  console.log(user)
  return (
    <div className="verify base">
      { is_verfied ? 
      <span>{user.email}님 이메일 인증이 완료되었습니다.</span> : 
      <span>이메일 인증에 문제가 있습니다.</span>
      }
    </div>
  );
}

export default Verify;
