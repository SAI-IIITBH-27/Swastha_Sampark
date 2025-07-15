import HarmonyNav from "../../layouts/Navbar";
import FormWithMap from "../../components/FormWithMap";
import "./FindRoute.css";

const FindRoute = () => {
  return (
    <>
      <HarmonyNav />
      <div className="find-route-container">
        <h2 className="page-title">Find the Best Route</h2>
        <FormWithMap />
      </div>
    </>
  );
};

export default FindRoute;
