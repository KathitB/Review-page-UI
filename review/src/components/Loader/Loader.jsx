import { FourSquare } from "react-loading-indicators";
import style from "./loader.module.scss";
const Loader = () => {
  return (
    <div className={style.loaderMain}>
      <div className={style.loaderCover}>
        {/* <div className={style.loader}></div> */}
        <FourSquare color="#f26639" size="medium" text="" textColor="" />
      </div>
    </div>
  );
};

export default Loader;
