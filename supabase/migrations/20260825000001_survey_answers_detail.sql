-- Guardar las respuestas individuales de la encuesta "Discover Your Mindset".
--
-- Hasta ahora survey_results solo guardaba `scores` (un contador por color),
-- del que no se puede reconstruir qué eligió la persona en cada pregunta.
-- La columna es nullable a propósito: las filas anteriores a esta migración
-- no tienen ese detalle y no es recuperable.
alter table public.survey_results
  add column if not exists answers jsonb;

comment on column public.survey_results.answers is
  'Array de respuestas elegidas: [{order, question_id, question_text, answer_id, answer_text, color}]. Null en registros previos al 25-ago-2026.';

-- Vista de lectura: una fila por respuesta, para revisar resultados sin escribir SQL.
-- security_invoker = on hace que la vista herede las políticas RLS de la tabla
-- base. Sin esto, la vista correría con permisos del owner y expondría los
-- datos de leads a cualquiera con la clave anon.
create or replace view public.survey_results_readable
with (security_invoker = on) as
select
  sr.id,
  sr.survey_completed_at,
  sr.name,
  sr.email,
  sr.dominant_belt_color,
  (a.value ->> 'order')::int as orden,
  a.value ->> 'question_text' as pregunta,
  a.value ->> 'answer_text'   as respuesta,
  a.value ->> 'color'         as color_respuesta
from public.survey_results sr
left join lateral jsonb_array_elements(coalesce(sr.answers, '[]'::jsonb)) a on true;

comment on view public.survey_results_readable is
  'Una fila por respuesta. Los registros sin detalle (previos al 25-ago-2026) aparecen con pregunta/respuesta en null.';
