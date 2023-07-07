import mongoose from "mongoose";

const VacancySchema = new mongoose.Schema({
  vacancies: {
    type: Number,
    required: true,
    default: 0,
  },
  vacanciesRequested: {
    type: Number,
    required: true,
    default: 0,
  },
  agency: {
    type: String,
    ref: "User",
    required: true,
  },
});

const Vacancy = mongoose.model("Vacancy", VacancySchema, "vacancies");

export default Vacancy;
