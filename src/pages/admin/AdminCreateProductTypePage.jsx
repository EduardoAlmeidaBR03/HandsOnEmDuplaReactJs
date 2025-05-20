// src/pages/admin/AdminCreateProductTypePage.jsx
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import productTypeService from '@services/productTypeService';

const AdminCreateProductTypePage = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const queryClient = useQueryClient();
    const productTypeToEdit = state?.productType;
    
    const [productType, setProductType] = useState({
        nome: ''
    });

    const [errors, setErrors] = useState({});

    // Se for um tipo de produto para editar, inicializa o estado com os dados do tipo
    useEffect(() => {
        if (productTypeToEdit) {
            setProductType({
                nome: productTypeToEdit.nome
            });
        }
    }, [productTypeToEdit]);

    const createProductTypeMutation = useMutation({
        mutationFn: productTypeService.createProductType,
        onSuccess: () => {
            toast.success('Tipo de produto criado com sucesso!', { icon: '✅' });
            navigate('/admin/product-types');
        },
        onError: (error) => {
            toast.error(`Erro ao criar tipo de produto: ${error.message}`, { icon: '❌' });
        }
    });

    const updateProductTypeMutation = useMutation({
        mutationFn: ({ id, ...fields }) => productTypeService.updateProductType(id, fields),
        onSuccess: () => {
            queryClient.invalidateQueries(['productTypes']).then(() => {
                toast.success('Tipo de produto atualizado com sucesso!', { icon: '✅' });
                navigate('/admin/product-types');
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
        setProductType((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!productType.nome.trim()) {
            newErrors.nome = 'O nome é obrigatório';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const payload = { ...productType };

            if (productTypeToEdit) {
                await updateProductTypeMutation.mutateAsync({ id: productTypeToEdit.id, ...payload });
            } else {
                await createProductTypeMutation.mutateAsync(payload);
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
                        <h2 className="mb-0">{productTypeToEdit ? 'Alterar Tipo de Produto' : 'Novo Tipo de Produto'}</h2>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="nome" className="form-label">Nome</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
                                    id="nome"
                                    name="nome"
                                    value={productType.nome}
                                    onChange={handleChange} 
                                    autoFocus />
                                {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
                            </div>

                            <div className="d-flex">
                                <button
                                    type="submit"
                                    className="btn btn-success me-2"
                                    disabled={createProductTypeMutation.isPending || updateProductTypeMutation.isPending}>
                                    {createProductTypeMutation.isPending || updateProductTypeMutation.isPending ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Salvando...
                                        </>
                                    ) : 'Salvar Tipo de Produto'}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => navigate('/admin/product-types')}>
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

export default AdminCreateProductTypePage;
