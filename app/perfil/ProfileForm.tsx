"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import Avatar from "@/app/components/ui/Avatar";
import { updateUserProfile } from "@/app/actions/profile";

const TOPICS = [
  "Desarrollo humano",
  "Desarrollo organizacional",
  "Herramientas tecnológicas",
  "Inteligencia comercial",
  "Legalidad y ética",
  "Rentabilidad comercial",
  "Tendencias globales",
  "Ventas",
  "Visión estratégica",
] as const;

export interface ProfileInitialData {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  organization: string;
  jobTitle: string;
  topicsOfInterest: string[];
  avatarUrl: string | null;
  isGoogleUser: boolean;
}

interface FieldErrors {
  firstName?: string;
  lastName?: string;
  country?: string;
  organization?: string;
  jobTitle?: string;
  topicsOfInterest?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

export default function ProfileForm({ initialData }: { initialData: ProfileInitialData }) {
  const router = useRouter();

  // ── Campos del perfil ────────────────────────────────────────────────────
  const [firstName, setFirstName] = useState(initialData.firstName);
  const [lastName, setLastName] = useState(initialData.lastName);
  const [country, setCountry] = useState(initialData.country);
  const [organization, setOrganization] = useState(initialData.organization);
  const [jobTitle, setJobTitle] = useState(initialData.jobTitle);
  const [topicsOfInterest, setTopicsOfInterest] = useState<string[]>(
    initialData.topicsOfInterest
  );

  // ── Campos de cuenta ─────────────────────────────────────────────────────
  const [email, setEmail] = useState(initialData.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // ── Estado UI ────────────────────────────────────────────────────────────
  const [isPending, setIsPending] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const emailChanged = email.trim() !== initialData.email;
  const passwordChanged = newPassword.length > 0;
  const needsReauth = emailChanged || passwordChanged;

  function toggleTopic(topic: string) {
    setTopicsOfInterest((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  }

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    if (!firstName.trim()) errors.firstName = "El nombre es obligatorio.";
    if (!lastName.trim()) errors.lastName = "El apellido es obligatorio.";
    if (!country.trim()) errors.country = "El país es obligatorio.";
    if (!organization.trim()) errors.organization = "La organización es obligatoria.";
    if (!jobTitle.trim()) errors.jobTitle = "El cargo es obligatorio.";
    if (topicsOfInterest.length === 0)
      errors.topicsOfInterest = "Selecciona al menos un tema de interés.";

    if (needsReauth && !currentPassword) {
      errors.currentPassword = "Introduce tu contraseña actual para guardar los cambios.";
    }
    if (passwordChanged) {
      if (newPassword.length < 8)
        errors.newPassword = "La nueva contraseña debe tener al menos 8 caracteres.";
      if (newPassword !== confirmNewPassword)
        errors.confirmNewPassword = "Las contraseñas no coinciden.";
    }
    return errors;
  }

  async function handleSave() {
    setGlobalError(null);
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setIsPending(true);

    try {
      // 1. Reautenticar si cambia email o contraseña
      if (needsReauth) {
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error("no_user");
        const credential = EmailAuthProvider.credential(
          initialData.email,
          currentPassword
        );
        await reauthenticateWithCredential(currentUser, credential);
      }

      // 2. Actualizar email en Firebase Auth
      if (emailChanged) {
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error("no_user");
        await updateEmail(currentUser, email.trim());
      }

      // 3. Actualizar contraseña en Firebase Auth
      if (passwordChanged) {
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error("no_user");
        await updatePassword(currentUser, newPassword);
      }

      // 4. Guardar datos de perfil en Firestore vía Server Action
      const result = await updateUserProfile({
        firstName,
        lastName,
        country,
        organization,
        jobTitle,
        topicsOfInterest,
        ...(emailChanged ? { email: email.trim() } : {}),
      });

      if (!result.success) {
        setGlobalError(result.error ?? "No se pudo guardar el perfil.");
        return;
      }

      router.push("/");
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (
        code === "auth/wrong-password" ||
        code === "auth/invalid-credential"
      ) {
        setFieldErrors({ currentPassword: "La contraseña actual es incorrecta." });
      } else if (code === "auth/email-already-in-use") {
        setGlobalError("Este correo ya está registrado con otra cuenta.");
      } else if (code === "auth/requires-recent-login") {
        setGlobalError(
          "Tu sesión ha expirado. Cierra sesión, vuelve a entrar e intenta de nuevo."
        );
      } else {
        setGlobalError("Ocurrió un error al guardar. Intenta de nuevo.");
      }
    } finally {
      setIsPending(false);
    }
  }

  // ── Clases reutilizables ──────────────────────────────────────────────────
  const inputClass =
    "w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gold disabled:opacity-60 text-sm";
  const labelClass = "block text-sm font-medium text-primary mb-1";
  const errorClass = "text-xs text-red-600 mt-1";

  return (
    <div className="space-y-8">
      {/* ── Avatar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-5">
        <Avatar
          displayName={
            firstName && lastName
              ? `${firstName} ${lastName}`
              : initialData.firstName && initialData.lastName
              ? `${initialData.firstName} ${initialData.lastName}`
              : null
          }
          email={initialData.email}
          size="lg"
        />
        <div>
          <button
            type="button"
            disabled
            title="Próximamente podrás cambiar tu foto de perfil"
            className="text-sm font-medium text-primary border border-gray-300 px-4 py-2 rounded opacity-40 cursor-not-allowed"
          >
            Cambiar foto
          </button>
          <p className="text-xs text-gray-400 mt-1">Disponible próximamente</p>
        </div>
      </div>

      {/* ── Información personal ────────────────────────────────────────── */}
      <fieldset>
        <legend className="text-base font-semibold text-primary mb-4 pb-2 border-b border-gray-100 w-full">
          Información personal
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className={labelClass}>
              Nombre
            </label>
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isPending}
              className={inputClass}
              aria-describedby={fieldErrors.firstName ? "err-firstName" : undefined}
            />
            {fieldErrors.firstName && (
              <p id="err-firstName" role="alert" className={errorClass}>
                {fieldErrors.firstName}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className={labelClass}>
              Apellidos
            </label>
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isPending}
              className={inputClass}
              aria-describedby={fieldErrors.lastName ? "err-lastName" : undefined}
            />
            {fieldErrors.lastName && (
              <p id="err-lastName" role="alert" className={errorClass}>
                {fieldErrors.lastName}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="country" className={labelClass}>
              País
            </label>
            <input
              id="country"
              type="text"
              autoComplete="country-name"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              disabled={isPending}
              className={inputClass}
              aria-describedby={fieldErrors.country ? "err-country" : undefined}
            />
            {fieldErrors.country && (
              <p id="err-country" role="alert" className={errorClass}>
                {fieldErrors.country}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="organization" className={labelClass}>
              Organización
            </label>
            <input
              id="organization"
              type="text"
              autoComplete="organization"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              disabled={isPending}
              className={inputClass}
              aria-describedby={fieldErrors.organization ? "err-organization" : undefined}
            />
            {fieldErrors.organization && (
              <p id="err-organization" role="alert" className={errorClass}>
                {fieldErrors.organization}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="jobTitle" className={labelClass}>
              Cargo
            </label>
            <input
              id="jobTitle"
              type="text"
              autoComplete="organization-title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              disabled={isPending}
              className={inputClass}
              aria-describedby={fieldErrors.jobTitle ? "err-jobTitle" : undefined}
            />
            {fieldErrors.jobTitle && (
              <p id="err-jobTitle" role="alert" className={errorClass}>
                {fieldErrors.jobTitle}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      {/* ── Temas de interés ────────────────────────────────────────────── */}
      <fieldset>
        <legend className="text-base font-semibold text-primary mb-1 pb-2 border-b border-gray-100 w-full">
          Temas de interés
        </legend>
        <p className="text-xs text-gray-500 mb-4">Selecciona todos los que apliquen.</p>
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          role="group"
          aria-label="Temas de interés"
        >
          {TOPICS.map((topic) => {
            const checked = topicsOfInterest.includes(topic);
            const id = `topic-${topic.replace(/\s+/g, "-").toLowerCase()}`;
            return (
              <label
                key={topic}
                htmlFor={id}
                className={`flex items-center gap-2 px-3 py-2 rounded border cursor-pointer text-sm transition-colors ${
                  checked
                    ? "border-gold bg-gold/10 text-primary font-medium"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <input
                  id={id}
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleTopic(topic)}
                  disabled={isPending}
                  className="accent-gold"
                />
                {topic}
              </label>
            );
          })}
        </div>
        {fieldErrors.topicsOfInterest && (
          <p role="alert" className={`${errorClass} mt-2`}>
            {fieldErrors.topicsOfInterest}
          </p>
        )}
      </fieldset>

      {/* ── Cuenta ──────────────────────────────────────────────────────── */}
      <fieldset>
        <legend className="text-base font-semibold text-primary mb-4 pb-2 border-b border-gray-100 w-full">
          Cuenta
        </legend>

        <div className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className={labelClass}>
              Correo electrónico
            </label>
            {initialData.isGoogleUser ? (
              <>
                <input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className={`${inputClass} bg-gray-50`}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Tu cuenta usa Google Sign-In. Gestiona tu correo desde tu cuenta de Google.
                </p>
              </>
            ) : (
              <>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isPending}
                  className={inputClass}
                />
                {emailChanged && (
                  <p className="text-xs text-amber-600 mt-1" role="status">
                    ⚠ Cambiar tu correo afectará tu próximo inicio de sesión. Necesitarás usar el nuevo correo para entrar.
                  </p>
                )}
              </>
            )}
          </div>

          {/* Contraseña — solo usuarios email/password */}
          {!initialData.isGoogleUser && (
            <>
              {(emailChanged || passwordChanged || fieldErrors.currentPassword) && (
                <div>
                  <label htmlFor="currentPassword" className={labelClass}>
                    Contraseña actual{" "}
                    <span className="text-gray-400 font-normal">(requerida para guardar cambios de cuenta)</span>
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={isPending}
                    className={inputClass}
                    aria-describedby={
                      fieldErrors.currentPassword ? "err-currentPassword" : undefined
                    }
                  />
                  {fieldErrors.currentPassword && (
                    <p id="err-currentPassword" role="alert" className={errorClass}>
                      {fieldErrors.currentPassword}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label htmlFor="newPassword" className={labelClass}>
                  Nueva contraseña{" "}
                  <span className="text-gray-400 font-normal">(déjala vacía si no deseas cambiarla)</span>
                </label>
                <input
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isPending}
                  className={inputClass}
                  aria-describedby={
                    fieldErrors.newPassword ? "err-newPassword" : undefined
                  }
                />
                {fieldErrors.newPassword && (
                  <p id="err-newPassword" role="alert" className={errorClass}>
                    {fieldErrors.newPassword}
                  </p>
                )}
              </div>

              {passwordChanged && (
                <div>
                  <label htmlFor="confirmNewPassword" className={labelClass}>
                    Confirmar nueva contraseña
                  </label>
                  <input
                    id="confirmNewPassword"
                    type="password"
                    autoComplete="new-password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    disabled={isPending}
                    className={inputClass}
                    aria-describedby={
                      fieldErrors.confirmNewPassword
                        ? "err-confirmNewPassword"
                        : undefined
                    }
                  />
                  {fieldErrors.confirmNewPassword && (
                    <p id="err-confirmNewPassword" role="alert" className={errorClass}>
                      {fieldErrors.confirmNewPassword}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </fieldset>

      {/* ── Error global ────────────────────────────────────────────────── */}
      {globalError && (
        <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3">
          {globalError}
        </p>
      )}

      {/* ── Botones ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={() => router.push("/")}
          disabled={isPending}
          className="text-sm text-gray-500 hover:text-primary transition-colors disabled:opacity-60 text-center sm:text-left"
        >
          Omitir por ahora
        </button>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push("/")}
            disabled={isPending}
            className="flex-1 sm:flex-none text-sm font-medium text-primary border border-gray-300 px-5 py-2 rounded hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="flex-1 sm:flex-none bg-gold hover:bg-gold-hover text-primary font-semibold text-sm px-6 py-2 rounded transition-colors disabled:opacity-60"
          >
            {isPending ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}
