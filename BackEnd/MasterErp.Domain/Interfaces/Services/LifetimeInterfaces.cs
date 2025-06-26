namespace MasterErp.Domain.Interfaces.Services;

/// <summary>
/// Interface marcadora para serviços com tempo de vida "Scoped".
/// Um novo objeto é criado para cada requisição HTTP.
/// </summary>
public interface IScopedService { }

/// <summary>
/// Interface marcadora para serviços com tempo de vida "Transient".
/// Um novo objeto é criado toda vez que é solicitado.
/// </summary>
public interface ITransientService { }

/// <summary>
/// Interface marcadora para serviços com tempo de vida "Singleton".
/// Um único objeto é criado e reutilizado por toda a aplicação.
/// </summary>
public interface ISingletonService { }
