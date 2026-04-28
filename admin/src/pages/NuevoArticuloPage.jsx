import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { toast } from '../services/toast.js';
import { crearArticulo } from '../services/wizardAPI.js';
import { step1Schema, step3Schema, wizardFullSchema } from '../services/wizardSchema.js';
import Stepper from '../components/wizard/Stepper.jsx';
import Step1Categoria from '../components/wizard/Step1Categoria.jsx';
import Step2Keyword from '../components/wizard/Step2Keyword.jsx';
import Step3Outline from '../components/wizard/Step3Outline.jsx';
import Step4Preview from '../components/wizard/Step4Preview.jsx';

const DRAFT_KEY = 'mg.admin.wizard.draft';

const EMPTY_STATE = {
  categoria: '',
  keyword: '',
  title: '',
  description: '',
  slug: '',
  coverAlt: '',
  edadMin: 4,
  edadMax: 12,
  nivel: 'facil',
  tags: [],
  outline: [],
};

function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function formatRelativeTime(ms) {
  const seconds = Math.floor((Date.now() - ms) / 1000);
  if (seconds < 60) return `hace ${seconds}s`;
  return `hace ${Math.floor(seconds / 60)}min`;
}

export default function NuevoArticuloPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [wizardState, setWizardState] = useState(() => loadDraft()?.state ?? EMPTY_STATE);
  const [lastSaved, setLastSaved] = useState(() => loadDraft()?.savedAt ?? null);
  const [, forceRender] = useState(0); // para actualizar el relativo "hace Xs"
  const [step2Valid, setStep2Valid] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Debounce al guardar en localStorage
  const debounceRef = useRef(null);
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const savedAt = Date.now();
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ state: wizardState, savedAt }));
      setLastSaved(savedAt);
    }, 500);
    return () => clearTimeout(debounceRef.current);
  }, [wizardState]);

  // Actualiza el label "hace Xs" cada segundo mientras la página está abierta
  useEffect(() => {
    const timer = setInterval(() => forceRender((n) => n + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  function patchState(patch) {
    setWizardState((prev) => ({ ...prev, ...patch }));
  }

  // Validación por paso para habilitar el botón "Continuar"
  function stepIsValid() {
    if (step === 1) {
      return step1Schema.safeParse({ categoria: wizardState.categoria }).success;
    }
    if (step === 2) {
      return step2Valid;
    }
    if (step === 3) {
      return step3Schema.safeParse({ outline: wizardState.outline }).success;
    }
    if (step === 4) {
      return wizardFullSchema.safeParse(wizardState).success;
    }
    return false;
  }

  function handleNext() {
    if (!stepIsValid()) return;
    if (step < 4) setStep((s) => s + 1);
  }

  function handleBack() {
    if (step > 1) setStep((s) => s - 1);
  }

  function clearDraft() {
    localStorage.removeItem(DRAFT_KEY);
    setWizardState(EMPTY_STATE);
    setLastSaved(null);
    setStep(1);
  }

  async function handleSubmit() {
    const validation = wizardFullSchema.safeParse(wizardState);
    if (!validation.success) {
      toast('Hay errores en el formulario. Revisa los pasos anteriores.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const result = await crearArticulo(wizardState);
      toast(`Artículo creado en ${result.filePath}. PR pendiente (Squad A3 lo automatizará).`, 'success');
      localStorage.removeItem(DRAFT_KEY);
      navigate('/');
    } catch (err) {
      console.warn('[wizard] POST /api/articulos/crear falló:', err.message);
      toast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  }

  const isLastStep = step === 4;
  const canContinue = stepIsValid();

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 0 60px' }}>
      {/* Page header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 18,
          marginBottom: 24,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <span className="stamp">Sprint 9 · Wizard</span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)' }}>Nuevo artículo</h1>
          <span
            style={{
              fontFamily: 'var(--font-hand)',
              color: 'var(--color-handwritten)',
              fontSize: 18,
              fontWeight: 600,
              transform: 'rotate(-1.5deg)',
              display: 'inline-block',
              marginTop: 4,
            }}
          >
            cuatro pasos, sin sustos
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {lastSaved && (
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--color-foreground-subtle)',
                letterSpacing: '0.04em',
              }}
            >
              Borrador guardado · {formatRelativeTime(lastSaved)}
            </span>
          )}
          <button
            type="button"
            onClick={clearDraft}
            title="Empezar de nuevo"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--color-foreground-subtle)',
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 6,
              padding: '4px 10px',
              cursor: 'pointer',
              minHeight: 'auto',
            }}
          >
            Empezar de nuevo
          </button>
          <button
            type="button"
            className="icon-btn"
            title="Volver al dashboard"
            onClick={() => navigate('/')}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <Stepper current={step} />

      {/* Pasos */}
      {step === 1 && (
        <Step1Categoria
          value={wizardState.categoria}
          onChange={(categoria) => patchState({ categoria })}
        />
      )}

      {step === 2 && (
        <Step2Keyword
          values={wizardState}
          categoria={wizardState.categoria}
          onValidChange={(fields, valid) => {
            patchState(fields);
            setStep2Valid(valid);
          }}
        />
      )}

      {step === 3 && (
        <Step3Outline
          outline={wizardState.outline}
          onChange={(outline) => patchState({ outline })}
        />
      )}

      {step === 4 && (
        <Step4Preview
          state={wizardState}
          submitting={submitting}
          onSubmit={handleSubmit}
        />
      )}

      {/* Barra de navegación inferior */}
      <nav
        aria-label="Navegación del asistente"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '16px 0 0',
          borderTop: '1px solid var(--color-border)',
          marginTop: 4,
        }}
      >
        <div>
          {step > 1 && (
            <button type="button" className="btn btn-ghost" onClick={handleBack}>
              <ArrowLeft size={16} />
              Atrás
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {!isLastStep ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleNext}
              disabled={!canContinue}
              style={{ opacity: canContinue ? 1 : 0.45, cursor: canContinue ? 'pointer' : 'not-allowed' }}
            >
              Continuar
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={submitting || !canContinue}
              style={{ opacity: !submitting && canContinue ? 1 : 0.45 }}
            >
              {submitting ? 'Generando…' : 'Generar artículo (draft)'}
              {!submitting && <ArrowRight size={16} />}
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}
