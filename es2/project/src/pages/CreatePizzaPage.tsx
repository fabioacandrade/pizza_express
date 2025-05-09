import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PizzaOption, ProductCategory } from '../types';
import { productApi, pizzaOptionApi } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import { getAllCategories } from '../utils/categories';
import { ArrowLeft, Plus, Upload } from 'lucide-react';

const pizzaOptionTypes = [
  { value: 'SIZE', label: 'Tamanho' },
  { value: 'DOUGH', label: 'Massa' },
  { value: 'CRUST', label: 'Borda' },
  { value: 'EXTRA', label: 'Adicionais' }
];

const CreatePizzaPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Pizza data state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [available, setAvailable] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>(ProductCategory.PIZZAS);
  
  // Options for pizza customization
  const [pizzaOptions, setPizzaOptions] = useState<PizzaOption[]>([]);
  const [filteredPizzaOptions, setFilteredPizzaOptions] = useState<PizzaOption[]>([]);
  const [selectedOptionType, setSelectedOptionType] = useState<string>('SIZE');
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  
  // Option creation states
  const [newOptionName, setNewOptionName] = useState('');
  const [newOptionPrice, setNewOptionPrice] = useState(0);
  const [newOptionType, setNewOptionType] = useState('SIZE');
  const [showNewOptionForm, setShowNewOptionForm] = useState(false);
  
  // Categories data - usando o utilitário de categorias diretamente
  const categories = getAllCategories();
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Fetch pizza options when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Buscando opções de pizza e tratando a resposta
        const optionsResponse = await pizzaOptionApi.getAll();
        console.log('Pizza options response:', optionsResponse);
        
        if (optionsResponse?.data) {
          setPizzaOptions(optionsResponse.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Erro ao carregar dados. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter pizza options by selected type
  useEffect(() => {
    setFilteredPizzaOptions(
      pizzaOptions.filter(option => option.type === selectedOptionType)
    );
  }, [selectedOptionType, pizzaOptions]);
  
  // Handle pizza option selection/deselection
  const toggleOptionSelection = (optionId: string) => {
    const newSelectedOptions = new Set(selectedOptions);
    
    if (newSelectedOptions.has(optionId)) {
      newSelectedOptions.delete(optionId);
    } else {
      newSelectedOptions.add(optionId);
    }
    
    setSelectedOptions(newSelectedOptions);
  };
  
  // Create a new pizza option
  const handleCreateOption = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newOptionName) {
      setError('Nome da opção é obrigatório.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await pizzaOptionApi.create({
        name: newOptionName,
        type: newOptionType as 'SIZE' | 'DOUGH' | 'CRUST' | 'EXTRA',
        additionalPrice: newOptionPrice
      });
      
      if (response && response.data) {
        // Add new option to state
        setPizzaOptions([...pizzaOptions, response.data]);
      }
      
      // Reset form
      setNewOptionName('');
      setNewOptionPrice(0);
      setShowNewOptionForm(false);
      setSuccessMessage('Opção criada com sucesso!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Erro ao criar opção. Tente novamente.');
      console.error('Error creating pizza option:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create the pizza
  const handleCreatePizza = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!name || !description || basePrice <= 0 || !imageUrl) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create the pizza product
      await productApi.create({
        name,
        description,
        basePrice,
        type: 'PIZZA',
        available,
        imageUrl,
        category: selectedCategory
      });
      
      setSuccessMessage('Pizza criada com sucesso!');
      
      // Clear success message and navigate back after a delay
      setTimeout(() => {
        setSuccessMessage('');
        navigate('/menu');
      }, 2000);
    } catch (err) {
      setError('Erro ao criar pizza. Tente novamente.');
      console.error('Error creating pizza:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Voltar
          </button>
          
          <h1 className="text-2xl font-bold text-gray-900">Cadastrar Nova Pizza</h1>
        </div>
        
        {/* Error and success messages */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
            <p className="text-green-700">{successMessage}</p>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Pizza basic information form */}
          <form onSubmit={handleCreatePizza} className="p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Informações Básicas</h2>
                <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  {/* Name */}
                  <div className="sm:col-span-3">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Nome
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      placeholder="Ex: Pizza Margherita"
                      required
                    />
                  </div>
                  
                  {/* Base price */}
                  <div className="sm:col-span-3">
                    <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700">
                      Preço Base (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      id="basePrice"
                      value={basePrice}
                      onChange={(e) => setBasePrice(parseFloat(e.target.value))}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      placeholder="Ex: 39.90"
                      required
                    />
                  </div>
                  
                  {/* Description */}
                  <div className="sm:col-span-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Descrição
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      placeholder="Ex: Molho de tomate, mussarela, manjericão fresco e azeite"
                      required
                    />
                  </div>
                  
                  {/* Image URL */}
                  <div className="sm:col-span-6">
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                      URL da Imagem
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                        <Upload size={16} />
                      </span>
                      <input
                        type="text"
                        id="imageUrl"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        placeholder="https://exemplo.com/imagem.jpg"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Category selection */}
                  <div className="sm:col-span-3">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Categoria
                    </label>
                    <select
                      id="category"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value as ProductCategory)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                      required
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Available switch */}
                  <div className="sm:col-span-3">
                    <fieldset>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center">
                          <input
                            id="available"
                            name="available"
                            type="checkbox"
                            checked={available}
                            onChange={(e) => setAvailable(e.target.checked)}
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          />
                          <label htmlFor="available" className="ml-3 block text-sm font-medium text-gray-700">
                            Disponível para venda
                          </label>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                </div>
              </div>
              
              {/* Pizza options section */}
              <div>
                <h2 className="text-lg font-medium text-gray-900">Opções de Personalização</h2>
                
                {/* Option type tabs */}
                <div className="mt-4 border-b border-gray-200">
                  <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    {pizzaOptionTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setSelectedOptionType(type.value)}
                        className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                          selectedOptionType === type.value
                            ? 'border-red-500 text-red-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </nav>
                </div>
                
                {/* Options list */}
                <div className="mt-4">
                  <div className="space-y-2">
                    {filteredPizzaOptions.length === 0 ? (
                      <p className="text-gray-500 italic">Nenhuma opção de {pizzaOptionTypes.find(type => type.value === selectedOptionType)?.label.toLowerCase()} encontrada.</p>
                    ) : (
                      filteredPizzaOptions.map((option) => (
                        <div
                          key={option.id}
                          className={`p-3 border rounded-md flex justify-between items-center cursor-pointer ${
                            selectedOptions.has(option.id)
                              ? 'bg-red-50 border-red-200'
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                          onClick={() => toggleOptionSelection(option.id)}
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedOptions.has(option.id)}
                              onChange={() => {}}
                              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                            />
                            <span className="ml-2">{option.name}</span>
                          </div>
                          <span>
                            {option.additionalPrice > 0 && `+${formatCurrency(option.additionalPrice)}`}
                            {option.additionalPrice < 0 && formatCurrency(option.additionalPrice)}
                            {option.additionalPrice === 0 && 'Sem custo adicional'}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Add new option button */}
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setNewOptionType(selectedOptionType);
                        setShowNewOptionForm(!showNewOptionForm);
                      }}
                      className="inline-flex items-center px-3 py-2 border border-dashed border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:text-gray-800 hover:border-gray-400"
                    >
                      <Plus size={16} className="mr-2" />
                      Adicionar nova opção de {pizzaOptionTypes.find(type => type.value === selectedOptionType)?.label.toLowerCase()}
                    </button>
                  </div>
                  
                  {/* New option form */}
                  {showNewOptionForm && (
                    <div className="mt-4 border border-gray-200 rounded-md p-4">
                      <h3 className="text-md font-medium text-gray-900 mb-3">
                        Nova opção de {pizzaOptionTypes.find(type => type.value === newOptionType)?.label.toLowerCase()}
                      </h3>
                      <form onSubmit={handleCreateOption} className="space-y-4">
                        <div>
                          <label htmlFor="optionName" className="block text-sm font-medium text-gray-700">
                            Nome
                          </label>
                          <input
                            type="text"
                            id="optionName"
                            value={newOptionName}
                            onChange={(e) => setNewOptionName(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            placeholder="Ex: Grande (35cm)"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="optionPrice" className="block text-sm font-medium text-gray-700">
                            Preço Adicional (R$)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            id="optionPrice"
                            value={newOptionPrice}
                            onChange={(e) => setNewOptionPrice(parseFloat(e.target.value))}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            placeholder="Ex: 10.00"
                          />
                          <p className="mt-1 text-xs text-gray-500">Use valores negativos para descontos (ex: -5.00)</p>
                        </div>
                        
                        <div className="flex justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => setShowNewOptionForm(false)}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                            disabled={isLoading}
                          >
                            {isLoading ? 'Salvando...' : 'Salvar Opção'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Submit button */}
              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Salvando...' : 'Salvar Pizza'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePizzaPage;