export default (secondTime) => {
  //분단위 변환
  let tmp_existTime = secondTime / 60;

  //시 계산
  const hourTime = String(Math.floor(tmp_existTime / 60));

  //분 계산
  tmp_existTime = tmp_existTime - hourTime * 60;
  const minTime = String(Math.floor(tmp_existTime));

  return { hourTime, minTime };
};
