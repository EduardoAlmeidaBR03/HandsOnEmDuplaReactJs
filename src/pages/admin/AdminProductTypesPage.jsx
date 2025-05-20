// src/pages/admin/AdminProductTypesPage.jsx
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import productTypeService from '@services/productTypeService';

const AdminProductTypesPage = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Lista de tipos de produtos
    const {
        data: productTypes,
        isLoading: loadingProductTypes,
        isError,
        error,
    } = useQuery({
        queryKey: ['productTypes'],
        queryFn: () => productTypeService.getAllProductTypes(),
    });    

    // Mutação para excluir tipo de produto
    const deleteMutation = useMutation({
        mutationFn: productTypeService.deleteProductType,
        onSuccess: () => {
            toast.success('Tipo de produto excluído', { icon: '🗑️' });
            queryClient.invalidateQueries(['productTypes']);
        },
        onError: (err) => toast.error(`Erro: ${err.message}`, { icon: '❌' }),
    });

    // Função para excluir tipo de produto
    const handleDelete = (id) => {
        if (window.confirm('Excluir tipo de produto? Esta ação é irreversível.')) {
            deleteMutation.mutate(id);
        }
    };

    // Função para editar tipo de produto
    const handleEdit = (productType) => {
        navigate(`/admin/product-types/edit/${productType.id}`, { state: { productType } });
    };

    if (isError) {
        return (
            <div className="alert alert-danger mt-4">
                Erro ao carregar tipos de produtos: {error.message}
            </div>
        );
    }

    return (
        <div className="row justify-content-center">
            <div className="col-12 mb-3">
                <div className="card">
                    <div className="card-header text-bg-light d-flex justify-content-between align-items-center py-3">
                        <h2 className="mb-0">Tipos de Produtos</h2>
                        <button
                            className="btn btn-success"
                            onClick={() => navigate('/admin/product-types/new')}>
                            Adicionar Tipo de Produto
                        </button>
                    </div>
                    <div className="card-body p-0">
                        {loadingProductTypes ? (
                            <div className="text-center my-5">
                                <div className="spinner-border" role="status"></div>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-striped align-middle mb-0">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>ID</th>
                                            <th>Nome</th>
                                            <th className="text-center">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productTypes?.length === 0 && (
                                            <tr>
                                                <td colSpan={3} className="text-center py-4">
                                                    Nenhum tipo de produto encontrado.
                                                </td>
                                            </tr>
                                        )}
                                        {productTypes && productTypes.map((productType) => (
                                            <tr key={productType.id}>
                                                <td>{productType.id}</td>
                                                <td>{productType.nome}</td>
                                                <td className="text-center one-line-cell px-3">
                                                    <button
                                                        className="btn btn-sm btn-outline-warning me-2"
                                                        onClick={() => handleEdit(productType)}>
                                                        Alterar
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDelete(productType.id)}>
                                                        Excluir
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProductTypesPage;
