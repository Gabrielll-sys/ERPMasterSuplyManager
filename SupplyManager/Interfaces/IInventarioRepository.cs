﻿using SupplyManager.Models;

namespace SupplyManager.Interfaces
{
    public interface IInventarioRepository
    {

        Task<Inventario> GetByIdAsync(int id);


        Task<List<Inventario>> GetAllAsync();

        Task<Inventario> CreateAsync(Inventario model);

        Task UpdateAsync(Inventario inventario);


        Task DeleteAsync(int id);
    }
}