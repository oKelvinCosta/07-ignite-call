import {
  Button,
  Checkbox,
  Heading,
  MultiStep,
  Text,
  TextInput,
} from "@ignite-ui/react";
import { ArrowRight } from "phosphor-react";
import { Container, Header } from "../styles";
import { FormError } from "./styles";

import {
  IntervalBox,
  IntervalContainer,
  IntervalDay,
  IntervalInputs,
  IntervalItem,
} from "./styles";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { getWeekDays } from "@/utils/get-week-days";
import { zodResolver } from "@hookform/resolvers/zod";
import { convertTimeStringToMinutes } from "@/utils/convert-time-string-to-minutes";
import { api } from "@/lib/axios";
import { useRouter } from "next/router";

const TimeIntervalsFormSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      })
    )
    .length(7)
    .transform((intervals) => intervals.filter((interval) => interval.enabled)) // The output of the form will be only the valid intervals
    .refine((intervals) => intervals.length > 0, {
      message: "Selecione pelo menos uma opção de intervalo de horário",
    })
    .transform((intervals) => {
      return intervals.map((intervals) => {
        return {
          weekDay: intervals.weekDay,
          startTimeInMinutes: convertTimeStringToMinutes(intervals.startTime),
          endTimeInMinutes: convertTimeStringToMinutes(intervals.endTime),
        };
      });
    })
    .refine(
      (intervals) => {
        return intervals.every(
          (interval) =>
            interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes
        );
      },
      {
        message:
          "O intervalo de horário deve ser maior que o intervalo de término em 1h.",
      }
    ),
});
// zod can transform data, for when arrives in the submit function

type TimeIntervalsFormInput = z.input<typeof TimeIntervalsFormSchema>;
type TimeIntervalsFormOutput = z.output<typeof TimeIntervalsFormSchema>;

export default function TimeIntervals() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<TimeIntervalsFormInput>({
    resolver: zodResolver(TimeIntervalsFormSchema),
    defaultValues: {
      intervals: [
        { weekDay: 0, enabled: false, startTime: "08:00", endTime: "18:00" },
        { weekDay: 1, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 2, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 3, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 4, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 5, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 6, enabled: false, startTime: "08:00", endTime: "18:00" },
      ],
    },
  });

  const router = useRouter();

  const weekDays = getWeekDays();

  const { fields } = useFieldArray({
    control, // From the useForm
    name: "intervals",
  });

  const intervals = watch("intervals");

  async function handleSetTimeIntervals(data: TimeIntervalsFormOutput) {
    console.log(data);
    const intervals = data;

    await api.post("/users/time-intervals", intervals);

    await router.push("/register/update-profile");
  }

  // [
  //   {day: 0, start: time, end: time},
  //   {day: 1, start: time, end: time},
  //   {day: 2, start: time, end: time},
  //   {day: 3, start: time, end: time},
  //   {day: 4, start: time, end: time},
  //   {day: 5, start: time, end: time},
  //   {day: 6, start: time, end: time},
  // ]

  return (
    <Container>
      <Header>
        <Heading as="strong">Quase lá</Heading>
        <Text>
          Defina o intervalo de horário que você está disponível em cada dia da
          semana.
        </Text>

        <MultiStep size={4} currentStep={3} />
      </Header>

      <IntervalBox as="form" onSubmit={handleSubmit(handleSetTimeIntervals)}>
        <IntervalContainer>
          {/* Loop of weekDays inputs */}
          {fields.map((field, index) => (
            <IntervalItem key={field.id}>
              <IntervalDay>
                {/* Controller is used to use components that is not html form by default */}
                <Controller
                  name={`intervals.${index}.enabled`}
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                      checked={field.value}
                    />
                  )}
                />
                <Text>{weekDays[field.weekDay]}</Text>
              </IntervalDay>
              <IntervalInputs>
                <TextInput
                  size="sm"
                  type="time"
                  step={60}
                  {...register(`intervals.${index}.startTime`)}
                  disabled={!intervals[index].enabled}
                />
                <TextInput
                  size="sm"
                  type="time"
                  step={60}
                  {...register(`intervals.${index}.endTime`)}
                  disabled={!intervals[index].enabled}
                />
              </IntervalInputs>
            </IntervalItem>
          ))}
        </IntervalContainer>

        {errors.intervals && (
          <FormError size="sm">{errors.intervals.message}</FormError>
        )}

        <Button type="submit" disabled={isSubmitting}>
          Próximo passo
          <ArrowRight />
        </Button>
      </IntervalBox>
    </Container>
  );
}
