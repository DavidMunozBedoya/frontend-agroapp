import { useState } from "react";

const UserLogin = (
  onSubmit?: (data: { email: string; password: string }) => void
) => {

  const [form, setForm] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });

  const serializarForm = (form: HTMLFormElement) => {
    const formData = new FormData(form);
    const datos: Record<string, string> = {};

    for (const [name, value] of formData) {
      datos[name] = value.toString();
    }

    return datos as { email: string; password: string };
  };

  const getData = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = serializarForm(e.currentTarget);

    setForm(data);

    if (onSubmit) {
      onSubmit(data);
    }
  };

  const changed = ({
    target,
  }: {
    target: HTMLInputElement | HTMLTextAreaElement;
  }) => {
    const { name, value } = target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  return { form, getData, changed };
};

export default UserLogin;