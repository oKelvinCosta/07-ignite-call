import { zodResolver } from "@hookform/resolvers/zod";
import {
  Avatar,
  Button,
  Heading,
  MultiStep,
  Text,
  TextArea,
  TextInput,
} from "@ignite-ui/react";
import { AxiosError } from "axios";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { ArrowRight } from "phosphor-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Container, Header } from "../styles";
import { FormAnnotation, ProfileBox } from "./styles";
import { useSession } from "next-auth/react";
import { unstable_getServerSession } from "next-auth";
import { buildNextAuthOptions } from "@/pages/api/auth/[...nextauth].api";
import { api } from "@/lib/axios";

const updateregisterFormSchema = z.object({
  bio: z.string(),
});

type UpdateFormData = z.infer<typeof updateregisterFormSchema>;

export default function UpdateProfile() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateFormData>({
    resolver: zodResolver(updateregisterFormSchema),
  });

  const session = useSession();
  console.log(session);

  const router = useRouter();

  async function handleUpdateProfile(data: UpdateFormData) {
    await api.put("/users/profile", {
      bio: data.bio,
    });

    await router.push(`/schedule/${session.data?.user.username}`);
  }

  return (
    <>
      <NextSeo title="Crie uma conta | Ignite Call" />

      <Container>
        <Header>
          <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>
          <Text>
            Precisamos de algumas informações para criar seu perfil! Ah, você
            pode editar essas informações depois.
          </Text>

          <MultiStep size={4} currentStep={4} />
        </Header>

        <ProfileBox as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
          <label>
            <Text size="sm">Nome de perfil</Text>
            {/* The avatar is better loaded in backend because CORS policy from google */}
            <Avatar
              src={session.data?.user.avatar_url}
              alt={session.data?.user.name}
              referrerPolicy="no-referrer"
            />
          </label>

          <label>
            <Text size="sm">Sobre você</Text>
            <TextArea {...register("bio")} />
            <FormAnnotation size="sm">
              Fale um pouco sobre você. Isso será exibido em sua página de
              perfil.
            </FormAnnotation>
          </label>

          <Button type="submit" disabled={isSubmitting}>
            Próximo passo
            <ArrowRight />
          </Button>
        </ProfileBox>
      </Container>
    </>
  );
}

// It is server side:
export const getServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res)
  );
  return {
    props: {
      session,
    },
  };
};
