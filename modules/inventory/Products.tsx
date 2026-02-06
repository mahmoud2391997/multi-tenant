
import React, { useState } from 'react';
import { Product } from '../../types';

interface ProductsProps {
  products: Product[];
  onAction: (entity: string, action: 'add' | 'edit' | 'delete', data: Product | string) => void;
}

const Products: React.FC<ProductsProps> = ({ products, onAction }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({ name: '', sku: '', price: 0, stock: 0, category: 'إلكترونيات' });

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({ name: '', sku: '', price: 0, stock: 0, category: 'إلكترونيات' });
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      id: editingProduct ? editingProduct.id : crypto.randomUUID(),
      price: Number(formData.price),
      stock: Number(formData.stock),
    } as Product;

    onAction('products', editingProduct ? 'edit' : 'add', data);
    setShowModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">إدارة المنتجات</h2>
          <p className="text-slate-500 text-sm mt-1">عرض وتعديل قائمة الأصناف والمخزون</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all flex items-center shadow-lg shadow-blue-200"
        >
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          إضافة منتج
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase">إجمالي الأصناف</p>
          <p className="text-xl font-black text-slate-900">{products.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase">قيمة المخزون</p>
          <p className="text-xl font-black text-blue-600">
            {products.reduce((acc, p) => acc + (p.price * p.stock), 0).toLocaleString()} ريال
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase">أصناف منخفضة المخزون</p>
          <p className="text-xl font-black text-rose-600">{products.filter(p => p.stock < 10).length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase">فئات المنتجات</p>
          <p className="text-xl font-black text-indigo-600">{new Set(products.map(p => p.category)).size}</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-right">
          <thead>
            <tr className="bg-slate-50/50 text-slate-500 text-[11px] uppercase tracking-widest border-b">
              <th className="px-8 py-5 font-black">المنتج</th>
              <th className="px-8 py-5 font-black">SKU</th>
              <th className="px-8 py-5 font-black">الفئة</th>
              <th className="px-8 py-5 font-black text-left">السعر</th>
              <th className="px-8 py-5 font-black text-center">المخزون</th>
              <th className="px-8 py-5 font-black text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-20 text-slate-400 font-bold">لا توجد منتجات مسجلة حالياً</td></tr>
            ) : products.map(product => (
              <tr key={product.id} className="hover:bg-slate-50/80 transition-all group">
                <td className="px-8 py-5 font-bold text-slate-800">{product.name}</td>
                <td className="px-8 py-5 font-mono text-xs text-slate-500">{product.sku}</td>
                <td className="px-8 py-5">
                  <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-lg text-[10px] font-bold">
                    {product.category}
                  </span>
                </td>
                <td className="px-8 py-5 text-left font-black text-slate-900">{product.price.toLocaleString()} ريال</td>
                <td className="px-8 py-5 text-center">
                  <span className={`font-black ${product.stock < 10 ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-8 py-5">
                   <div className="flex justify-center space-x-2 space-x-reverse transition-all">
                     <button onClick={() => handleOpenModal(product)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                     </button>
                     <button onClick={() => onAction('products', 'delete', product.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                     </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-xl font-black mb-6">{editingProduct ? 'تعديل منتج' : 'إضافة منتج جديد'}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">اسم المنتج</label>
                <input type="text" placeholder="مثال: لابتوب ألترا" required className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:ring-2 focus:ring-blue-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">رقم الموديل (SKU)</label>
                <input type="text" placeholder="LAP-001" required className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:ring-2 focus:ring-blue-500 font-mono" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">السعر</label>
                  <input type="number" placeholder="0.00" required className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:ring-2 focus:ring-blue-500" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">المخزون الحالي</label>
                  <input type="number" placeholder="0" required className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:ring-2 focus:ring-blue-500" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">الفئة</label>
                <select className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:ring-2 focus:ring-blue-500" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="إلكترونيات">إلكترونيات</option>
                  <option value="ملحقات">ملحقات</option>
                  <option value="أثاث">أثاث</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>
            </div>
            <div className="mt-8 flex space-x-3 space-x-reverse">
              <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors">حفظ المنتج</button>
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors">إلغاء</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Products;
