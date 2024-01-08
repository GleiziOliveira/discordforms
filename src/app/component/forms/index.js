'use client'
// Importa as bibliotecas necessárias
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define o esquema de validação para o formulário de contato
const contactFormSchema = z.object({
  name: z.string().min(3).max(100),
  email: z.string().email(),
  message: z.string().min(1).max(500),
  checkbox: z.boolean().refine(value => value === true, {
    message: 'Você deve concordar com as políticas de privacidade para enviar a mensagem.',
  }),
});

// Componente de formulário de contato
const ContactForm = () => {
  // Configuração do formulário usando react-hook-form e zodResolver
  const { handleSubmit, register, reset, getValues } = useForm({
    resolver: zodResolver(contactFormSchema),
  });

  // Função chamada quando o formulário é enviado
  const onSubmit = async (data) => {
    // Verifica se o checkbox está marcado
    const checkboxChecked = getValues('checkbox');
    if (!checkboxChecked) {
      alert('Você deve concordar com as políticas de privacidade para enviar a mensagem.');
      return;
    }

    try {
      // Envia os dados para a API de contato
      await axios.post('/api/contact', data);
      
      // Exibe mensagem de sucesso e limpa o formulário
      alert('Mensagem enviada com sucesso');
      reset();
    } catch (error) {
      // Exibe mensagem de erro em caso de falha no envio
      alert('Ocorreu um erro ao enviar a mensagem. Tente novamente');
      console.error(error);
    }
  };


  // Retorna o JSX do componente de formulário
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-100 p-3">
      <div className="mb-3">
        <label htmlFor="nomeCompleto" className="form-label">
          Nome Completo
        </label>
        <input
          {...register('name')}
          type="text"
          className="form-control"
          id="nomeCompleto"
          placeholder="João A. Santos"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="emailEmpresarial" className="form-label">
          E-mail Empresarial
        </label>
        <input
          {...register('email')}
          type="email"
          className="form-control"
          id="emailEmpresarial"
          placeholder="integra@integra.com"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="mensagem" className="form-label">
          Mensagem
        </label>
        <textarea
          {...register('message')}
          className="form-control"
          id="mensagem"
          rows="3"
        ></textarea>
      </div>
      <div className="form-check mb-3">
        <input
          {...register('checkbox', { required: true })}
          className="form-check-input"
          type="checkbox"
          id="checkedbox"
        />
        <label className="form-check-label" htmlFor="checkedbox">
          Concordo com as políticas de privacidade.
        </label>
      </div>
      <div className="v-100">
        <button type="submit" className="btn btn-primary">
          Enviar Mensagem
        </button>
      </div>
    </form>
  )
}

export { ContactForm }
