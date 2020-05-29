function getViewportSize() {
  const doc = document;
  const docE = doc.documentElement;
  const body = doc.body;
  return {
    width: (docE && docE.clientWidth) || (body && body.offsetWidth) || window.innerWidth || 0,
    height: (docE && docE.clientHeight) || (body && body.offsetHeight) || window.innerHeight || 0,
  };
}

export default function (params) {
  let width = params.width;
  let height = params.height;
  const vpSize = getViewportSize();
  if (params.width > vpSize.width) {
    height = (vpSize.width * height) / width;
    width = vpSize.width;
  }
  return {
    appID: '1253886863',
    fileID: params.fileID,
    width: width,
    height: height,
  };
}
