﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using SupplyManager.App;

#nullable disable

namespace SupplyManager.Migrations
{
    [DbContext(typeof(SqlContext))]
    [Migration("20231130131823_v18")]
    partial class v18
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.13")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("SupplyManager.Models.Inventario", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("DataAlteracao")
                        .HasColumnType("datetime");

                    b.Property<float?>("Estoque")
                        .HasColumnType("float");

                    b.Property<int?>("MaterialId")
                        .IsRequired()
                        .HasColumnType("int");

                    b.Property<float?>("Movimentacao")
                        .HasColumnType("float");

                    b.Property<string>("Razao")
                        .HasColumnType("longtext");

                    b.Property<string>("Responsavel")
                        .HasColumnType("longtext");

                    b.Property<float?>("SaldoFinal")
                        .HasColumnType("float");

                    b.HasKey("Id");

                    b.HasIndex("MaterialId");

                    b.ToTable("Inventarios");
                });

            modelBuilder.Entity("SupplyManager.Models.Item", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int>("MaterialId")
                        .HasColumnType("int");

                    b.Property<int>("OrdemServicoId")
                        .HasColumnType("int");

                    b.Property<float?>("Quantidade")
                        .HasColumnType("float");

                    b.HasKey("Id");

                    b.HasIndex("MaterialId");

                    b.HasIndex("OrdemServicoId");

                    b.ToTable("Itens");
                });

            modelBuilder.Entity("SupplyManager.Models.Material", b =>
                {
                    b.Property<int?>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Categoria")
                        .HasColumnType("longtext");

                    b.Property<string>("CodigoFabricante")
                        .HasColumnType("longtext");

                    b.Property<string>("CodigoInterno")
                        .HasColumnType("longtext");

                    b.Property<string>("Corrente")
                        .HasColumnType("longtext");

                    b.Property<DateTime?>("DataEntradaNF")
                        .HasColumnType("datetime");

                    b.Property<string>("Descricao")
                        .HasColumnType("longtext");

                    b.Property<string>("Localizacao")
                        .HasColumnType("longtext");

                    b.Property<string>("Marca")
                        .HasColumnType("longtext");

                    b.Property<float?>("Markup")
                        .HasColumnType("float");

                    b.Property<float?>("PrecoCusto")
                        .HasColumnType("float");

                    b.Property<float?>("PrecoVenda")
                        .HasColumnType("float");

                    b.Property<string>("Tensao")
                        .HasColumnType("longtext");

                    b.Property<string>("Unidade")
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("Materiais");
                });

            modelBuilder.Entity("SupplyManager.Models.OrdemServico", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime?>("DataAbertura")
                        .HasColumnType("datetime");

                    b.Property<DateTime?>("DataAutorizacao")
                        .HasColumnType("datetime");

                    b.Property<DateTime?>("DataFechamento")
                        .HasColumnType("datetime");

                    b.Property<string>("Descricao")
                        .HasColumnType("longtext");

                    b.Property<bool>("IsAuthorized")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("Observacao")
                        .HasColumnType("longtext");

                    b.Property<string>("OsBrastorno")
                        .HasColumnType("longtext");

                    b.Property<decimal>("PrecoTotalEquipamentosOs")
                        .HasColumnType("decimal(65,30)");

                    b.Property<string>("ResponsavelAutorizacao")
                        .HasColumnType("longtext");

                    b.Property<string>("ResponsavelExecucao")
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("OrdemServicos");
                });

            modelBuilder.Entity("SupplyManager.Models.Usuario", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Nome")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Senha")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("Usuários");
                });

            modelBuilder.Entity("SupplyManager.Models.Inventario", b =>
                {
                    b.HasOne("SupplyManager.Models.Material", "Material")
                        .WithMany()
                        .HasForeignKey("MaterialId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Material");
                });

            modelBuilder.Entity("SupplyManager.Models.Item", b =>
                {
                    b.HasOne("SupplyManager.Models.Material", "Material")
                        .WithMany()
                        .HasForeignKey("MaterialId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("SupplyManager.Models.OrdemServico", "OrdemServico")
                        .WithMany()
                        .HasForeignKey("OrdemServicoId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Material");

                    b.Navigation("OrdemServico");
                });
#pragma warning restore 612, 618
        }
    }
}