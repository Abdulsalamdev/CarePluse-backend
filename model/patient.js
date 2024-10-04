const mongoose = require("mongoose");
const Joi = require("joi");

const patientSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "username is required"],
      validate: {
        validator: function (v) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    occupation: {
      type: String,
      required: true,
    },
    emergency_contact_name: {
      type: String,
      required: true,
    },
    emergency_contact_number: {
      type: String,
      required: true,
    },
    date_Of_birth: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    medical_informations: {
      care_physician: {
        type: String,
        required: true,
      },
      insurance_provider: {
        type: String,
        required: true,
      },
      insurance_provider_number: {
        type: String,
        required: true,
      },
      allergies: {
        type: String,
        required: true,
      },
      current_medication: {
        type: String,
        required: true,
      },
      family_medical_history: {
        type: String,
        required: true,
      },
      medical_history: {
        type: String,
        required: true,
      },
    },
    identification_verification: {
      identification_type: {
        type: String,
        enum: [
          "Passport",
          "Driver License",
          "Birth certificate",
          "Student ID Card",
          "Marriage Certificate",
          "Military ID",
          "Voter Card",
          "State ID Card",
        ],
        required: true,
      },
      identification_number: { type: String, required: true },
      file: {
        fileName: {
          type: String,
          required: [true, "Filename is required"], // e.g., 'document.pdf'
        },
        filePath: {
          type: String,
          match: [
            /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/,
            "Please provide a valid image URL",
          ],
        },
      },
    },
    consent_privacy: {
      first_privacy: Boolean,
      second_privacy: Boolean,
      third_privacy: Boolean,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const patientAppointmentSchema = new mongoose.Schema(
  {
    doctor: {
      type: String,
      required: true,
    },
    appointment_reason: {
      type: String,
      required: true,
    },
    additional_reason: {
      type: String,
      required: true,
    },
    appointment_date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Patient = mongoose.model("Patient", patientSchema);
const PatientAppointment = mongoose.model(
  "PatientAppointment",
  patientAppointmentSchema
);

const AppointmentValidator = (appointment) => {
  const schema = Joi.object({
    doctor: Joi.string().required(),
    appointment_reason: Joi.string().required(),
    additional_reason: Joi.string().required(),
    appointment_date: Joi.string().required(),
  });
  return schema.validate(appointment);
};
const PatientValidator = (patient) => {
  const schema = Joi.object({
    full_name: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string()
      .pattern(/^\+?\d{1,3}?\d{7,14}$/)
      .required(),
    email: Joi.string()
      .email({ tlds: { allow: true } })
      .required(),
    occupation: Joi.string().required(),
    emergency_contact_name: Joi.string().required(),
    emergency_contact_number: Joi.string().required(),
    date_Of_birth: Joi.string().required(),
    gender: Joi.string().required(),
    care_physician: Joi.string().required(),
    insurance_provider: Joi.string().required(),
    insurance_provider_number: Joi.string().required(),
    allergies: Joi.string().required(),
    current_medication: Joi.string().required(),
    family_medical_history: Joi.string().required(),
    medical_history: Joi.string().required(),
    identification_type: Joi.string()
      .valid(
        "Passport",
        "Driver License",
        "Birth certificate",
        "Student ID Card",
        "Marriage Certificate",
        "Military ID",
        "Voter Card",
        "State ID Card"
      )
      .required(),
    identification_number: Joi.string().required(),
    // fileName: Joi.string().required(),
    // filePath: Joi.string().required(),
    first_privacy: Joi.boolean(),
    second_privacy: Joi.boolean(),
    third_privacy: Joi.boolean(),
  });
  return schema.validate(patient);
};
module.exports = { Patient, PatientValidator, AppointmentValidator };
