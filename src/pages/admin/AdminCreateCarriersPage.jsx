// src/pages/admin/AdminCreateCarriersPage.jsx
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import carrier from '@services/carrierService';

const AdminCreateCarriersPage = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const queryClient = useQueryClient();
    const carrierToEdit = state?.productType;
    
    const [productType, setCarrier] = useState({
        name: ''
    });

    const [errors, setErrors] = useState({});

    // Se for um tipo de produto para editar, inicializa o estado com os dados do tipo
    useEffect(() => {
        if (carrierToEdit) {
            setCarrier({
                name: carrierToEdit.name
            });
        }
    }, [carrierToEdit]);

    const createCarrierMutation = useMutation({
        mutationFn: carrier.createCarrier,
        onSuccess: () => {
            toast.success('Tipo de produto criado com sucesso!', { icon: '✅' });
            navigate('/admin/carriers');
        },
        onError: (error) => {
            toast.error(`Erro ao criar tipo de produto: ${error.message}`, { icon: '❌' });
        }
    });

    const updateCarrierMutation = useMutation({
        mutationFn: ({ id, ...fields }) => productCarrier.updateProductType(id, fields),
        onSuccess: () => {
            queryClient.invalidateQueries(['carriers']).then(() => {
                toast.success('Tipo de produto atualizado com sucesso!', { icon: '✅' });
                navigate('/admin/carriers');
            }).catch((error) => {
                toast.error(`Erro ao atualizar lista de tipos de produto: ${error.message}`, { icon: '❌' });
            });
        },
        onError: (error) => {
            toast.error(`Erro ao atualizar tipo de produto: ${error.message}`, { icon: '❌' });
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCarrier((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!productType.name.trim()) {
            newErrors.name = 'O name é obrigatório';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const payload = { ...productType };

            if (carrierToEdit) {
                await updateCarrierMutation.mutateAsync({ id: carrierToEdit.id, ...payload });
            } else {
                await createCarrierMutation.mutateAsync(payload);
            }
        } catch (err) {
            toast.error(`Erro ao salvar: ${err.message}`, { icon: '❌' });
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-8">
                <div className="card">
                    <div className="card-header text-bg-light">
                        <h2 className="mb-0">{carrierToEdit ? 'Alterar Tipo de Produto' : 'Novo Tipo de Produto'}</h2>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Nome</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    id="name"
                                    name="name"
                                    value={carrier.name}
                                    onChange={handleChange} 
                                    autoFocus />
                                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                            </div>

                            <div className="d-flex">
                                <button
                                    type="submit"
                                    className="btn btn-success me-2"
                                    disabled={createCarrierMutation.isPending || updateCarrierMutation.isPending}>
                                    {createCarrierMutation.isPending || updateCarrierMutation.isPending ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Salvando...
                                        </>
                                    ) : 'Salvar Tipo de Produto'}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => navigate('/admin/carriers')}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCreateCarriersPage;
