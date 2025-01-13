import React, { useState } from "react";

export const useForm = (initialForm) => {
  const [formValues, setFormValues] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const validationErrors = {};
    if (!formValues.email.trim()) {
      validationErrors.email = "El correo es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      validationErrors.email = "Introduce un correo válido.";
    }

    if (!formValues.password.trim()) {
      validationErrors.password = "La contraseña es obligatoria.";
    } else if (formValues.password.length < 6) {
      validationErrors.password =
        "La contraseña debe tener al menos 6 caracteres.";
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    validateForm();
  };
  return {
    ...formValues,
    handleChange,
    errors,
  };
};
