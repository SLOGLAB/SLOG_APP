export default (targetFiles, canvasId, max_size, setFileValue) => {
  const dataURLToBlob = (dataURL) => {
    const BASE64_MARKER = ';base64,';

    // base64로 인코딩 되어있지 않을 경우
    if (dataURL.indexOf(BASE64_MARKER) === -1) {
      const parts = dataURL.split(',');
      const contentType = parts[0].split(':')[1];
      const raw = parts[1];
      return new Blob([raw], {
        type: contentType,
      });
    }
    // base64로 인코딩 된 이진데이터일 경우
    const parts = dataURL.split(BASE64_MARKER);
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    // atob()는 Base64를 디코딩하는 메서드
    const rawLength = raw.length;
    // 부호 없는 1byte 정수 배열을 생성
    const uInt8Array = new Uint8Array(rawLength); // 길이만 지정된 배열
    let i = 0;
    while (i < rawLength) {
      uInt8Array[i] = raw.charCodeAt(i);
      i++;
    }
    return new Blob([uInt8Array], {
      type: contentType,
    });
  };

  const resize_image = (image) => {
    let canvas = document.getElementById(canvasId),
      width = image.width,
      height = image.height;
    if (width > height) {
      // 가로가 길 경우
      if (width > max_size) {
        height *= max_size / width;
        width = max_size;
      }
    } else {
      // 세로가 길 경우
      if (height > max_size) {
        width *= max_size / height;
        height = max_size;
      }
    }
    //캔버스 비율을 사진과 맞춰주기
    if (width < height) {
      canvas.width = width;
      canvas.height = width;
    } else {
      canvas.width = height;
      canvas.height = height;
    }
    canvas
      .getContext('2d')
      .drawImage(
        image,
        canvas.width / 2 - width / 2,
        canvas.height / 2 - height / 2,
        width,
        height,
      );
    const dataUrl = canvas.toDataURL('image/jpeg');
    const finalBlobImg = dataURLToBlob(dataUrl);
    setFileValue(finalBlobImg);
  };

  const files = targetFiles;
  const filesArr = Array.prototype.slice.call(files);

  filesArr.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new Image();
      // image.className = 'img-item'; // 스타일 적용을 위해
      image.src = e.target.result;
      image.onload = (imageEvent) => {
        // 이미지가 로드가 되면! 리사이즈 함수가 실행되도록 합니다.
        resize_image(image);
      };
    };
    reader.readAsDataURL(file);
  });
};
