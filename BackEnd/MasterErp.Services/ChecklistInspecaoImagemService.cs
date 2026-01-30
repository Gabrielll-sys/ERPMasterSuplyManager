using MasterErp.Domain.Interfaces.Repository;
using MasterErp.Domain.Interfaces.Services;
using MasterErp.Domain.Models;

namespace MasterErp.Services;

// Servico para imagens vinculadas a checklists de inspecao.
public class ChecklistInspecaoImagemService : IChecklistInspecaoImagemService, IScopedService
{
    private readonly IChecklistInspecaoImagemRepository _repository;
    private readonly IChecklistInspecaoRepository _checklistRepository;

    public ChecklistInspecaoImagemService(
        IChecklistInspecaoImagemRepository repository,
        IChecklistInspecaoRepository checklistRepository)
    {
        _repository = repository;
        _checklistRepository = checklistRepository;
    }

    public Task<List<ChecklistInspecaoImagem>> GetByChecklistIdAsync(int checklistId)
    {
        return _repository.GetByChecklistIdAsync(checklistId);
    }

    public Task<ChecklistInspecaoImagem?> GetByIdAsync(int id)
    {
        return _repository.GetByIdAsync(id);
    }

    public async Task<ChecklistInspecaoImagem> CreateAsync(int checklistId, ChecklistInspecaoImagem model)
    {
        // Valida se o checklist existe antes de vincular a imagem.
        var checklist = await _checklistRepository.GetByIdAsync(checklistId);
        if (checklist == null) throw new KeyNotFoundException("Checklist nao encontrado");

        var imagem = new ChecklistInspecaoImagem
        {
            ChecklistInspecaoId = checklistId,
            ImageUrl = model.ImageUrl ?? string.Empty,
            ImageKey = model.ImageKey ?? string.Empty,
            CriadoEm = DateTime.UtcNow.AddHours(-3)
        };

        return await _repository.CreateAsync(imagem);
    }

    public async Task DeleteAsync(int id)
    {
        var imagem = await _repository.GetByIdAsync(id) ?? throw new KeyNotFoundException("Imagem nao encontrada");
        await _repository.DeleteAsync(imagem);
    }
}
