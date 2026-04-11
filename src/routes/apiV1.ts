import express from "express";
import adminRouter from "./adminRoutes";
import authRoutes from "./authRoutes";
import familyRouter from "./familyRoutes";
import patientRouter from "./patientRoutes";
import recordRouter from "./recordRoutes";
import appointmentRouter from "./appointmentRoutes";
import dashboardRouter from "./dashboardRoutes";
import staffRouter from "./staffRoutes";
import hospitalRouter from "./hospitalRoutes";

const apiV1Router = express.Router();

apiV1Router.use("/auth", authRoutes);
apiV1Router.use("/admin", adminRouter);
apiV1Router.use("/patients", patientRouter);
apiV1Router.use("/families", familyRouter);
apiV1Router.use("/records", recordRouter);
apiV1Router.use("/appointments", appointmentRouter);
apiV1Router.use("/dashboard", dashboardRouter);
apiV1Router.use("/staff", staffRouter);
apiV1Router.use("/hospital", hospitalRouter);
export default apiV1Router;
