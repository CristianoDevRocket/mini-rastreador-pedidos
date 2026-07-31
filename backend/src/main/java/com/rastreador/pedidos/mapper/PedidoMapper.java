package com.rastreador.pedidos.mapper;

import com.rastreador.pedidos.dto.request.ItemRequest;
import com.rastreador.pedidos.dto.request.PedidoRequest;
import com.rastreador.pedidos.dto.response.ItemResponse;
import com.rastreador.pedidos.dto.response.PedidoResponse;
import com.rastreador.pedidos.entity.ItemPedido;
import com.rastreador.pedidos.entity.Pedido;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PedidoMapper {

    public Pedido toEntity(PedidoRequest request) {
        Pedido pedido = Pedido.builder()
                .cliente(request.cliente())
                .enderecoEntrega(request.enderecoEntrega())
                .build();

        request.itens().stream()
                .map(this::toItemEntity)
                .forEach(pedido::adicionarItem);

        return pedido;
    }

    public PedidoResponse toResponse(Pedido pedido) {
        List<ItemResponse> itens = pedido.getItens().stream()
                .map(item -> new ItemResponse(item.getDescricao(), item.getQuantidade()))
                .toList();

        return new PedidoResponse(
                pedido.getId(),
                pedido.getCliente(),
                pedido.getEnderecoEntrega(),
                pedido.getStatus(),
                itens,
                pedido.getCreatedAt()
        );
    }

    private ItemPedido toItemEntity(ItemRequest request) {
        return ItemPedido.builder()
                .descricao(request.descricao())
                .quantidade(request.quantidade())
                .build();
    }
}
