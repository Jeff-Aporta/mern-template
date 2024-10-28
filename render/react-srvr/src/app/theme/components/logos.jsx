const PUBLIC_URL = process.env.PUBLIC_URL;

function LogoBanner(params) {
  const updatedParams = { ...params };
  updatedParams.width ??= 160;
  updatedParams.href ??= "/";

  return LOAD_IMG_SZS({
    szs: [1024],
    src: (sz) => `img/logo/texto/v4-w=${sz}.svg`, // Asegúrate de que esta ruta es correcta
    ...updatedParams,
  });
}

function Logo404(params) {
  return LOAD_IMG_SZS({
    szs: [512, 1024],
    src: (sz) => `img/logo/states/404-w=${sz}.png`, // Asegúrate de que esta ruta es correcta
    ...params,
  });
}

function LOAD_IMG_SZS(params) {
  const p = { ...params };
  delete p.src;
  delete p.szs;
  delete p.width;
  delete p.href;

  const { src, szs, width = 300, href } = params;
  const sz = szs
    .sort()
    .reverse()
    .find((w) => width <= w);

  const imageUrl = src(sz);

  const img = (
    <img src={`${PUBLIC_URL}/${imageUrl}`} width={`${width}px`} {...p} alt="" />
  );
  if (href) {
    return <a href={href} tabIndex={0}>{img}</a>;
  }
  return img;
}

export { LogoBanner, Logo404 };
